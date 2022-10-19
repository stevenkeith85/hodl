import { ActionTypes } from "../../models/HodlAction";
import { ethers } from "ethers";
import { Redis } from '@upstash/redis';
import { getTagsForToken } from "../../pages/api/tags";
import { MutableToken } from "../../models/Nft";
import { getMutableToken } from "../../pages/api/contracts/mutable-token/[tokenId]";
import { LogDescription } from "ethers/lib/utils";
import { updateHodlingCache } from "../../pages/api/contracts/token/hodling/count";
import { updateTransactionRecords } from "./updateTransactionRecords";
import { runRedisTransaction } from "../databaseUtils";
import { updateListedCache } from "../../pages/api/contracts/market/listed/count";
import { addToZeplo } from "../addToZeplo";

const client = Redis.fromEnv()

// event TokenBought(
//     address indexed buyer,
//     address indexed seller,
//     uint256 indexed tokenId,
//     uint256 price
// );
export const tokenBought = async (
    hash: string, // check valid address?
    tx: ethers.providers.TransactionResponse,
    log: LogDescription,
    req
) => {
    const start = Date.now();
    console.log(`tokenBought - processing tx`);

    if (log.name !== 'TokenBought') {
        console.log('tokenBought - called with a non buying transaction');
        return true;
    }

    const {
        buyer,
        seller,
        tokenId: tokenIdBN,
        price: priceInWei
    } = log.args;

    const price = ethers.utils.formatEther(priceInWei);
    const tokenId = tokenIdBN.toNumber();

    // Read the blockchain to ensure what we are about to do is correct
    const token: MutableToken = await getMutableToken(tokenId, true);

    if (token.forSale) {
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
    
    // Clear the avatar if the user still has it
    const currentAvatar = await client.hmget(`user:${seller}`, 'avatar');
    if (currentAvatar === tokenId) {
        await client.hmset(`user:${seller}`, { 'avatar': '' });
    }

    const recordsUpdated = await updateTransactionRecords(req.address, tx.nonce, hash);

    if (!recordsUpdated) {
        return false;
    }

    const updateHodlingCachePromise = updateHodlingCache(req.address);
    const updateListedCachePromise = updateListedCache(seller);

    Promise.all([updateHodlingCachePromise, updateListedCachePromise]);

    const action = {
        action: ActionTypes.Bought,
        subject: buyer,
        object: "token",
        objectId: tokenId,
        metadata: {
            price,
            seller
        }
    };

    await addToZeplo(
        "api/actions/add",
        action,
        req.cookies.refreshToken,    
        req.cookies.accessToken,
    );

    const stop = Date.now()
    console.log('tokenBought time taken', stop - start);

    return action;
}
