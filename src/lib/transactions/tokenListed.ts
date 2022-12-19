import { ActionTypes } from "../../models/HodlAction";

import { formatEther } from '@ethersproject/units'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { LogDescription } from '@ethersproject/abi'

import { Redis } from '@upstash/redis';
import { getTagsForToken } from "../../pages/api/tags";
import { getMutableToken } from "../../pages/api/contracts/mutable-token/[tokenId]";
import { MutableToken } from "../../models/MutableToken";
import { updateHodlingCache } from "../../pages/api/contracts/token/hodling/updateCache";

import { updateTransactionRecords } from "./updateTransactionRecords";
import { runRedisTransaction } from "../database/rest/databaseUtils";
import { updateListedCache } from "../../pages/api/contracts/market/listed/count";
import { addToZeplo } from "../addToZeplo";


const client = Redis.fromEnv()

// returns whether we've successfully handled this log
// dediciding not to process it can also be a 'success'

// event TokenListed(
//     address indexed seller,
//     uint256 indexed tokenId,
//     uint256 price
// );
export const tokenListed = async (
    hash: string, // check valid address?
    tx: TransactionResponse,
    log: LogDescription,
    req
) => {
    const start = Date.now();
    console.log(`tokenListed - processing tx`);

    const { tokenId: tokenIdBN, seller, price: priceInWei } = log.args;

    const price = formatEther(priceInWei);
    const tokenId = tokenIdBN.toNumber();

    // Some basic sanity checks
    if (log.name !== 'TokenListed') {
        console.log('tokenListed - called with a non listing transaction');
        return true;
    }

    // Read the blockchain to ensure what we are about to do is correct
    // This also updates our cache :)
    const token: MutableToken = await getMutableToken(tokenId, true);

    if (!token.forSale) {
        console.log('tokenListed - token is not for sale according to the blockchain - not listing on market');
        return true;
    }

    if (token.price !== price) {
        console.log('tokenListed - token is listed at a different price on the blockchain to the provided tx; strange! - not listing on market');
        return true;
    }

    const marketListing = await client.zscore(`market`, tokenId);

    // if the market is not up to date, add an entry and the relevant tag entries
    if (marketListing === null) {
        console.log('adding market listing');

        const cmds = [
            ['ZADD', 'market', price, tokenId]
        ];

        const tags = await getTagsForToken(tokenId);
        for (const tag of tags) {
            cmds.push(
                ['ZADD', `market:${tag}`, price, tokenId]
            );
        }

        const success = await runRedisTransaction(cmds);

        if (!success) {
            return false;
        }
    } 

    const recordsUpdated = await updateTransactionRecords(req.address, tx.nonce, hash);

    if (!recordsUpdated) {
        return false;
    }

    addToZeplo(
        'api/contracts/token/hodling/updateCache',
        {
            address: req.address
        },
        req.cookies.refreshToken,
        req.cookies.accessToken
    )
    
    // TODO: Via Message Queue
    await updateListedCache(req.address);

    const action = {
        subject: req.address,
        action: ActionTypes.Listed,
        object: "token",
        objectId: tokenId,
        metadata: { price }
    };

    const stop = Date.now()
    console.log('tokenListed time taken', stop - start);

    return action;
}
