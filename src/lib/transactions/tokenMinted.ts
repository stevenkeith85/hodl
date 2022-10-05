import { HodlAction, ActionTypes } from "../../models/HodlAction";
import { ethers } from "ethers";
import { Redis } from '@upstash/redis';

import {
    getInfuraIPFSAuth,
    ipfsUriToCid,
    ipfsUriToGatewayUrl,
    TAG_PATTERN} from "../utils";

import NFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import axios from 'axios';
import { Token } from "../../models/Token";
import { addTokenToTag } from "../../pages/api/tags/add";
import { addAction } from "../../pages/api/actions/add";
import { HodlMetadata } from "../../models/Metadata";
import { trimZSet } from "../databaseUtils";
import { LogDescription } from "ethers/lib/utils";

const client = Redis.fromEnv()


// This endpoint is pretty much idempotent now. There's always a chance some redis call fails that isn't wrapped
// in a multi / exec... but that's on the TODO list
export const tokenMinted = async (
    hash: string, // check valid address?
    provider: ethers.providers.BaseProvider,
    txReceipt: ethers.providers.TransactionReceipt,
    tx: ethers.providers.TransactionResponse,
    log: LogDescription
): Promise<boolean> => {
    console.log(`tokenMinted - processing tx`);

    // event Transfer(address from, address to, uint256 tokenId)
    const { from, to, tokenId } = log.args;

    // some basic sanity checks
    if (log.name !== 'Transfer') {
        console.log('tokenMinted - called with a non transfer transaction');
        return false;
    }

    if (from !== ethers.constants.AddressZero) {
        console.log('tokenMinted - this is not a mint - not adding');
        return false;
    }

    if (tx.value.isZero()) {
        console.log('tokenMinted - no mint fee was paid - not adding');
        return false;
    }

    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, provider);
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
                uri: ipfsUriToCid(uri),
                license,
                mimeType
            }
        }
    };

    // use the block timestamp for accuracy
    const block = await provider.getBlock(tx.blockHash);

    // store token, and add to sorted set with timestamp
    // TODO: Make this a multi/exec in redis
    const tokenAdded = await client.setnx(`token:${token.id}`, token);

    if (!tokenAdded) {
        console.log('tokenMinted - token already exists in database, aborting');
        return false;
    }

    const added = await client.zadd(`tokens`,
        { nx: true },
        {
            score: block.timestamp,
            member: token.id,
        }
    );

    if (added) {
        await client.zadd(`tokens:new`,
            { nx: true },
            {
                score: block.timestamp,
                member: token.id,
            }
        );

        trimZSet(client, 'tokens:new', 1000);
    }

    // extract tags
    // @ts-ignore
    const tags = [...description.matchAll(TAG_PATTERN)].map(arr => arr[1])

    // Add tags. (NB: only the first 6 will be added)
    for (const tag of tags) {
        await addTokenToTag(tag, token.id);
    }

    const minted: HodlAction = {
        subject: to,
        action: ActionTypes.Added,
        object: "token",
        objectId: token.id
    }

    const success = addAction(minted);

    if (!success) {
        console.log(`tokenMinted - unable to add the action`);
        return false;
    }

    return true;
}