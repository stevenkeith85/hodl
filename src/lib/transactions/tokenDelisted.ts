import { ActionTypes } from "../../models/HodlAction";

import { Redis } from '@upstash/redis';
import { getTagsForToken } from "../../pages/api/tags";

import { updateTransactionRecords } from "./updateTransactionRecords";
import { runRedisTransaction } from "../database/rest/databaseUtils";

import { TransactionResponse } from '@ethersproject/abstract-provider'
import { LogDescription } from '@ethersproject/abi'
import { addToZeplo } from "../addToZeplo";
import { getListingFromBlockchain } from "../../pages/api/contracts/market/listing/[tokenId]";

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
    const listing = await getListingFromBlockchain(tokenId);

    if (listing !== null) {
        console.log('tokenBought - token is still for sale according to the blockchain');
        return true;
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
        'api/contracts/mutable-token/updateCache',
        {
            id: tokenId
        },
        req.cookies.refreshToken,
        req.cookies.accessToken
    )

    addToZeplo(
        'api/contracts/token/hodling/updateCache',
        {
            address: req.address
        },
        req.cookies.refreshToken,
        req.cookies.accessToken
    )

    addToZeplo(
        'api/contracts/market/listed/updateCache',
        {
            address: req.address
        },
        req.cookies.refreshToken,
        req.cookies.accessToken
    );

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
