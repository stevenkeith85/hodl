import { ActionTypes } from "../../models/HodlAction";
import { ethers } from "ethers";
import { Redis } from '@upstash/redis';

import {
    getInfuraIPFSAuth,
    ipfsUriToCid,
    ipfsUriToGatewayUrl,
    MAX_TAGS_PER_TOKEN,
    TAG_PATTERN
} from "../utils";

import NFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import axios from 'axios';
import { Token } from "../../models/Token";
import { HodlMetadata } from "../../models/Metadata";
import { LogDescription } from "ethers/lib/utils";
import { updateHodlingCache } from "../../pages/api/contracts/token/hodling/count";
import { updateTransactionRecords } from "./updateTransactionRecords";
import { addActionToQueue } from "../actions/addToQueue";

const client = Redis.fromEnv()


// Boolean indicates that we've finished processing this blockchain action
// Usually this is true for 'success'; but we may also decide to just
// refuse to process it if it looks sus.
export const tokenMinted = async (
    hash: string, // check valid address?
    provider: ethers.providers.BaseProvider,
    txReceipt: ethers.providers.TransactionReceipt,
    tx: ethers.providers.TransactionResponse,
    log: LogDescription,
    req
): Promise<boolean> => {

    // const start = new Date();

    // event Transfer(address from, address to, uint256 tokenId)
    const { from, to, tokenId } = log.args;

    // some basic sanity checks
    if (log.name !== 'Transfer') {
        console.log('tokenMinted - log.name !== Transfer');
        return true; // successfully rejected this; do not re-attempt to process it
    }

    if (from !== ethers.constants.AddressZero) {
        console.log('tokenMinted - "from" !== AddressZero');
        return true; // successfully rejected this; do not re-attempt to process it
    }

    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, provider);
    const metadataUrl: string = await contract.tokenURI(tokenId);

    if (metadataUrl === '') {
        console.log('tokenMinted - tokenURI is the empty string!');
        return true; // successfully rejected this; do not re-attempt to process it
    }

    if (!metadataUrl.startsWith('ipfs://')) {
        console.log('tokenMinted - tokenURI is not an IPFS URI!');
        return true; // successfully rejected this; do not re-attempt to process it
    }

    let metadata: HodlMetadata;

    try {
        const { data } = await axios.get(ipfsUriToGatewayUrl(metadataUrl), { headers: getInfuraIPFSAuth() });
        metadata = data;
    } catch (e) {
        console.log(`tokenMinted - error getting the metadata ${e.toJSON()}`)
        return false; // We will likely want to retry this; so its an unsuccessful run of this function
    };

    const {
        name,
        description,
        image,
        properties: {
            asset: {
                uri,
                license,
                mimeType
            },
            aspectRatio,
            filter
        }
    } = metadata;

    // NB: We just store the cid as its simpler to construct the relevant urls from it
    const token: Token = {
        id: tokenId.toNumber(),
        creator: to,
        metadata: ipfsUriToCid(metadataUrl),

        name,
        description,
        image: ipfsUriToCid(image),

        properties: {
            aspectRatio,
            filter,
            asset: {
                uri: ipfsUriToCid(uri),
                license,
                mimeType
            }
        }
    };

    // use the block timestamp for accuracy
    const block = await provider.getBlock(tx.blockHash);

    const tokenExists = await client.exists(`token:${token.id}`);

    if (!tokenExists) {
        console.log('tokenMinted - token does not exist, atomically updating redis')
        try {
            const r = await axios.post(
                `${process.env.UPSTASH_REDIS_REST_URL}/multi-exec`,
                [
                    ["SET", `token:${token.id}`, JSON.stringify(token)],
                    ["ZADD", `tokens`, block.timestamp, token.id],
                    ["ZADD", `tokens:new`, block.timestamp, token.id],
                    ["ZREMRANGEBYRANK", `tokens:new`, 0, -(1000 + 1)],
                ],
                {
                    headers: {
                        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
                    }
                })

            const response = r.data;

            if (response.error) {
                console.log('tokenMinted - redis add token transaction was discarded', response);
                return false; // We will likely want to retry this; so its an unsuccessful run of this function
            }
        } catch (e) {
            console.log('tokenMinted - upstash rest api error', e)
            return false; // We will likely want to retry this; so its an unsuccessful run of this function
        }
    }

    // TODO: This potentially could be split off into a separate message queue task?
    // Add tags. 
    const tagsExist = await client.exists(`token:${token.id}:tags`);

    if (!tagsExist) {
        console.log('tokenMinted - tags do not exist, atomically updating redis')
        const tags = Array.from(description.matchAll(TAG_PATTERN)).map(arr => arr[1]);
        const uniqueTags = Array.from(new Set(tags)).slice(0, MAX_TAGS_PER_TOKEN);

        const addTagsTxCommands = [];
        for (const tag of uniqueTags) {
            const tagLC = tag.toLowerCase();

            addTagsTxCommands.push(["SADD", `token:${token.id}:tags`, tagLC])
            addTagsTxCommands.push(["ZADD", `tag:${tagLC}`, block.timestamp, token.id])
            addTagsTxCommands.push(["ZADD", `tag:${tagLC}:new`, block.timestamp, token.id])
            addTagsTxCommands.push(["ZREMRANGEBYRANK", `tag:${tagLC}:new`, 0, -(500 + 1)]);
            addTagsTxCommands.push(["ZINCRBY", `rankings:tag:count`, 1, tagLC]);
            addTagsTxCommands.push(["ZREMRANGEBYRANK", `rankings:tag:count`, 0, -(500 + 1)]);
        }

        try {
            const r = await axios.post(
                `${process.env.UPSTASH_REDIS_REST_URL}/multi-exec`,
                addTagsTxCommands,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
                    }
                })

            const response = r.data;

            if (response.error) {
                console.log('tokenMinted - redis add tags transaction was discarded', response);
                return false; // We will likely want to retry this; so its an unsuccessful run of this function
            }
        } catch (e) {
            console.log('tokenMinted - upstash rest api error', e)
            return false; // We will likely want to retry this; so its an unsuccessful run of this function
        }
    }

    const actionAdded = await addActionToQueue(
        req.cookies.accessToken,
        req.cookies.refreshToken,
        {
            subject: req.address,
            action: ActionTypes.Added,
            object: "token",
            objectId: token.id
        });

    if (!actionAdded) {
        return false;
    }
 
    const recordsUpdated = await updateTransactionRecords(req.address, tx.nonce, hash);

    if (!recordsUpdated) {
        return false;
    }

    await updateHodlingCache(req.address);

    // const stop = new Date();
    // console.log('time taken', stop - start);
    return true;
}