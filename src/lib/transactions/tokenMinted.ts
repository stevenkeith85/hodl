import { HodlAction, ActionTypes } from "../../models/HodlAction";
import { BigNumber, ethers } from "ethers";
import { getProvider } from "../server/connections";
import { nftaddress, nftmarketaddress } from "../../../config";
import { Redis } from '@upstash/redis';

import {
    getInfuraIPFSAuth,
    ipfsUriToCid,
    ipfsUriToGatewayUrl,
    NUMBER_OF_CONFIRMATIONS_TO_WAIT_FOR,
    TAG_PATTERN,
    TRANSACTION_TIMEOUT
} from "../utils";

import NFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import axios from 'axios';
import { Token } from "../../models/Token";
import { addTokenToTag } from "../../pages/api/tags/add";
import { addAction } from "../../pages/api/actions/add";
import { HodlMetadata } from "../../models/Metadata";
import { fromUnixTime } from "date-fns";

const client = Redis.fromEnv()

// event Transfer(address from, address to, uint256 tokenId)
// TODO: EVERYTHING ON THIS ENDPOINT SHOULD BE IDEMPOTENT (IN PROGRESS)
export const tokenMinted = async (
    hash: string, // check valid address?
    provider: ethers.providers.BaseProvider,
    txReceipt: ethers.providers.TransactionReceipt,
    tx: ethers.providers.TransactionResponse
): Promise<boolean> => {
    const contract = new ethers.Contract(nftaddress, NFT.abi, provider);

    const log: ethers.utils.LogDescription = contract.interface.parseLog(txReceipt.logs?.[0]);
    console.log(`tokenMinted - processing tx`);

    const { from, to, tokenId } = log.args;

    // some basic sanity checks
    if (from !== ethers.constants.AddressZero) {
        console.log('tokenMinted - this is not a mint - not adding');
        return false;
    }

    if (tx.value.isZero()) {
        console.log('tokenMinted - no mint fee was paid - not adding');
        return false;
    }

    const metadataUrl: string = await contract.tokenURI(tokenId);

    if (!metadataUrl) {
        console.log('tokenMinted - cannot get token metadata - not adding');
        return false;
    }

    const { data } = await axios.get(ipfsUriToGatewayUrl(metadataUrl), {
        headers: getInfuraIPFSAuth()
    });

    const metadata: HodlMetadata = data;
    console.log('tokenMinted - metadata', metadata);

    const { name, description, image, properties: { asset: { uri, license, mimeType }, aspectRatio, filter } } = metadata;

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
                uri,
                license,
                mimeType
            }
        }
    };

    // use the block timestamp for idempotence
    const block = await provider.getBlock(tx.blockHash);

    // store token, and add to sorted set with timestamp
    // TODO: Make this a transaction in redis
    const tokenAdded = await client.setnx(`token:${token.id}`, token);

    if (!tokenAdded) {
        console.log('tokenMinted - token already exists in database, aborting');    
        return false;
    }

    await client.zadd(`tokens`,
        { nx: true },
        {
            score: block.timestamp,
            member: token.id,
        }
    );

    // extract tags
    // @ts-ignore
    const tags = [...description.matchAll(TAG_PATTERN)].map(arr => arr[1])

    // Add tags. (NB: only the first 6 will be added)
    for (const tag of tags) {
        await addTokenToTag(tag, token.id);
    }

    const success = addAction({
        subject: to,
        action: ActionTypes.Added,
        object: "token",
        objectId: token.id
    });

    // TODO: If we successfully process this transaction, we should probably record that in our database 
    // and stop users re-running old / out of order transactions
}