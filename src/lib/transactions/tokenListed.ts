import { ActionTypes } from "../../models/HodlAction";
import { ethers } from "ethers";
import { Redis } from '@upstash/redis';
import { getTagsForToken } from "../../pages/api/tags";
import { getMutableToken } from "../../pages/api/contracts/mutable-token/[tokenId]";
import { MutableToken } from "../../models/Nft";
import { updateHodlingCache } from "../../pages/api/contracts/token/hodling/count";
import { LogDescription } from "ethers/lib/utils";
import { updateTransactionRecords } from "./updateTransactionRecords";
import axios from 'axios';
import { addActionToQueue } from "../actions/addToQueue";
import { runRedisTransaction } from "../databaseUtils";

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
    tx: ethers.providers.TransactionResponse,
    log: LogDescription,
    req
): Promise<boolean> => {
    const start = Date.now();
    console.log(`tokenListed - processing tx`);

    const { tokenId: tokenIdBN, seller, price: priceInWei } = log.args;

    const price = ethers.utils.formatEther(priceInWei);
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

    const actionAdded = await addActionToQueue(
        req.cookies.accessToken,
        req.cookies.refreshToken,
        {
            subject: req.address,
            action: ActionTypes.Listed,
            object: "token",
            objectId: tokenId,
            metadata: { price }
        });

    if (!actionAdded) {
        return false;
    }

    const recordsUpdated = await updateTransactionRecords(req.address, tx.nonce, hash);

    if (!recordsUpdated) {
        return false;
    }

    await updateHodlingCache(req.address);

    const stop = Date.now()
    console.log('tokenListed time taken', stop - start);

    // TODO: Update listed cached

    return true;
}
