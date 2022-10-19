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
import { addToZeplo } from "../addToZeplo";

const client = Redis.fromEnv()


// returns whether we've successfully handled this log
// dediciding not to process it can also be a 'success'

// event Transfer(address from, address to, uint256 tokenId)
export const tokenMinted = async (
    hash: string, // check valid address?
    provider: ethers.providers.BaseProvider,
    tx: ethers.providers.TransactionResponse,
    log: LogDescription,
    req
) => {
    const start = Date.now();

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

        const multiExecCmds = [
            // Add the token information
            ["SET", `token:${token.id}`, JSON.stringify(token)],

            // Add the token to the set of all tokens
            ["ZADD", `tokens`, block.timestamp, token.id],

            // Add the token to the new token set and trim it to 1000 items
            ["ZADD", `tokens:new`, block.timestamp, token.id],
            ["ZREMRANGEBYRANK", `tokens:new`, 0, -(1000 + 1)],
        ];

        const tags = Array.from(description.matchAll(TAG_PATTERN)).map(arr => arr[1]);
        const uniqueTags = Array.from(new Set(tags)).slice(0, MAX_TAGS_PER_TOKEN);

        for (const tag of uniqueTags) {
            const tagLC = tag.toLowerCase();

            // update the token's set of tags
            multiExecCmds.push(["SADD", `token:${token.id}:tags`, tagLC]);

            // update the tag's set of token ids
            multiExecCmds.push(["ZADD", `tag:${tagLC}`, block.timestamp, token.id])

            // update the tags set of new token ids and trim to 500 items
            multiExecCmds.push(["ZADD", `tag:${tagLC}:new`, block.timestamp, token.id])
            multiExecCmds.push(["ZREMRANGEBYRANK", `tag:${tagLC}:new`, 0, -(500 + 1)]);

            // update the most popular tag rankings and trim to 500 items
            multiExecCmds.push(["ZINCRBY", `rankings:tag:count`, 1, tagLC]);
            multiExecCmds.push(["ZREMRANGEBYRANK", `rankings:tag:count`, 0, -(500 + 1)]);
        }

        // Run the transaction
        try {
            const r = await axios.post(
                `${process.env.UPSTASH_REDIS_REST_URL}/multi-exec`,
                multiExecCmds,
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

    const recordsUpdated = await updateTransactionRecords(req.address, tx.nonce, hash);

    if (!recordsUpdated) {
        return false;
    }

    // We should possibly split this off into its own serverless function, and call it as part of our 'steps' ?
    await updateHodlingCache(req.address);

    // We can either add the action to the queue here; 
    // or return it and use zeplos 'steps' feature 
    // to automatically add it if this serverless function succeeds

    // The 'steps' option is likely better as it will reduce the time this serverless function runs :)
    const action = {
        subject: req.address,
        action: ActionTypes.Added,
        object: "token",
        objectId: token.id
    };

    await addToZeplo(
        'api/actions/add',
        action,
        req.cookies.refreshToken,
        req.cookies.accessToken
    );

    const stop = Date.now()
    console.log('tokenMinted time taken', stop - start);

    return action;
}