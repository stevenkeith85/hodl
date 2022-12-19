import { ActionTypes } from "../../models/HodlAction";

import { Redis } from '@upstash/redis';
import { getTagsForToken } from "../../pages/api/tags";
import { MutableToken } from "../../models/MutableToken";
import { getMutableToken } from "../../pages/api/contracts/mutable-token/[tokenId]";

import { updateTransactionRecords } from "./updateTransactionRecords";
import { updateHodlingCache } from "../../pages/api/contracts/token/hodling/updateCache";
import { runRedisTransaction } from "../database/rest/databaseUtils";
import { updateListedCache } from "../../pages/api/contracts/market/listed/count";

import { TransactionResponse } from '@ethersproject/abstract-provider'
import { LogDescription } from '@ethersproject/abi'
import { addToZeplo } from "../addToZeplo";

const client = Redis.fromEnv()

// event TokenDelisted(
//     address indexed seller, 
//     uint256 indexed tokenId
// );
export const tokenDelisted = async (
    hash: string, // check valid address?
    tx: TransactionResponse,
    log: LogDescription,
    req
) => {
    const start = Date.now();
    console.log(`tokenDelisted - processing tx`);

    const { tokenId: tokenIdBN, seller } = log.args;
    const tokenId = tokenIdBN.toNumber();

    // Some basic sanity checks
    if (log.name !== 'TokenDelisted') {
        console.log('tokenDelisted - called with a non delisting transaction');
        return false;
    }

    // Read the blockchain to ensure what we are about to do is correct
    // This also updates our cache
    const token: MutableToken = await getMutableToken(tokenId, true);

    if (token.forSale) {
        console.log('tokenDelisted - token is still for sale according to the blockchain');
        return;
    }

    const marketListing = await client.zscore(`market`, tokenId);

    if (marketListing !== null) {
        const cmds = [
            ['ZREM', 'market', tokenId]
        ];

        const tags = await getTagsForToken(tokenId);
        for (const tag of tags) {
            cmds.push(
                ['ZREM', `market:${tag}`, tokenId]
            )
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
        action: ActionTypes.Delisted,
        object: "token",
        objectId: tokenId
    };

    const stop = Date.now()
    console.log('tokenDelisted time taken', stop - start);

    return action;
}
