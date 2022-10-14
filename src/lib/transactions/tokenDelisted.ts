import { HodlAction, ActionTypes } from "../../models/HodlAction";
import { ethers } from "ethers";
import { Redis } from '@upstash/redis';
import { addAction } from "../../pages/api/actions/add";
import Market from '../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import { getTagsForToken } from "../../pages/api/tags";
import { FullToken } from "../../models/Nft";
import { getFullToken } from "../../pages/api/contracts/mutable-token/[tokenId]";

const client = Redis.fromEnv()

// event TokenDelisted(
//     address indexed seller, 
//     uint256 indexed tokenId
// );
export const tokenDelisted = async (
    hash: string, // check valid address?
    provider: ethers.providers.BaseProvider,
    txReceipt: ethers.providers.TransactionReceipt,
    tx: ethers.providers.TransactionResponse
): Promise<boolean> => {
    console.log(`tokenDelisted - processing tx`);

    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, provider);

    const log: ethers.utils.LogDescription = contract.interface.parseLog(txReceipt.logs?.[0]);
    
    const { tokenId: tokenIdBN, seller } = log.args;
    const tokenId = tokenIdBN.toNumber();

    // Some basic sanity checks
    if (log.name !== 'TokenDelisted') {
        console.log('tokenDelisted - called with a non delisting transaction');
        return false;
    }

    // Read the blockchain to ensure what we are about to do is correct
    const token: FullToken = await getFullToken(tokenId, true);

    if (token.forSale) {
        console.log('tokenDelisted - token is still for sale according to the blockchain - not delisting from market');
        return;
    }

    const removed = await client.zrem(`market`, tokenId);

    if (!removed) {
        console.log('tokenDelisted - token is not listed on market, aborting');
        return false;
    }

    const tags = await getTagsForToken(tokenId);

    for (const tag of tags) {
        const removed = await client.zrem(`market:${tag}`, tokenId);

        if (!removed) {
            console.log(`tokenDeListed - unable to remove token from market:${tag} zset`);
            // we do not abort here as we might as well try adding the other tags
            // TODO: Better fault tolerance here
        }
    }

    // TODO: Perhaps we just add the notifications to another queue, and let that happen async
    const delisted: HodlAction = {
        timestamp: Date.now(), // TODO: perhaps we can get the timestamp of the transaction confirmation?
        action: ActionTypes.Delisted,
        subject: seller,
        object: "token",
        objectId: tokenId,
    };

    const success = await addAction(delisted);

    if (!success) {
        console.log(`tokenDelisted - unable to add the action`);
        return false;
    }

    return true;
}
