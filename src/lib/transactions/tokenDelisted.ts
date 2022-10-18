import { ActionTypes } from "../../models/HodlAction";
import { ethers } from "ethers";
import { Redis } from '@upstash/redis';
import { getTagsForToken } from "../../pages/api/tags";
import { MutableToken } from "../../models/Nft";
import { getMutableToken } from "../../pages/api/contracts/mutable-token/[tokenId]";
import { LogDescription } from "ethers/lib/utils";
import { updateTransactionRecords } from "./updateTransactionRecords";
import { updateHodlingCache } from "../../pages/api/contracts/token/hodling/count";
import { addActionToQueue } from "../actions/addToQueue";
import { runRedisTransaction } from "../databaseUtils";
import { updateListedCache } from "../../pages/api/contracts/market/listed/count";

const client = Redis.fromEnv()

// event TokenDelisted(
//     address indexed seller, 
//     uint256 indexed tokenId
// );
export const tokenDelisted = async (
    hash: string, // check valid address?
    tx: ethers.providers.TransactionResponse,
    log: LogDescription,
    req
): Promise<boolean> => {
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

    const actionAdded = await addActionToQueue(
        req.cookies.accessToken,
        req.cookies.refreshToken,
        {
            subject: req.address,
            action: ActionTypes.Delisted,
            object: "token",
            objectId: tokenId
        });

    if (!actionAdded) {
        return false;
    }

    const recordsUpdated = await updateTransactionRecords(req.address, tx.nonce, hash);

    if (!recordsUpdated) {
        return false;
    }

    const updateHodlingCachePromise = updateHodlingCache(req.address);
    const updateListedCachePromise = updateListedCache(req.address);

    Promise.all([updateHodlingCachePromise, updateListedCachePromise]);

    const stop = Date.now()
    console.log('tokenDelisted time taken', stop - start);
    // TODO: Update listed cached

    return true;
}
