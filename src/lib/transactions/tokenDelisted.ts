import { HodlAction, ActionTypes } from "../../models/HodlAction";
import { ethers } from "ethers";
import { nftmarketaddress } from "../../../config";
import { Redis } from '@upstash/redis';


import { addAction } from "../../pages/api/actions/add";
import Market from '../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import { getTagsForToken } from "../../pages/api/tags";
import { Nft } from "../../models/Nft";
import { fetchNFT } from "../../pages/api/nft/[tokenId]";

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

    const contract = new ethers.Contract(nftmarketaddress, Market.abi, provider);

    const log: ethers.utils.LogDescription = contract.interface.parseLog(txReceipt.logs?.[0]);
    console.log(`tokenDelisted - processing tx`);

    const { tokenId: tokenIdBN, seller } = log.args;
    const tokenId = tokenIdBN.toNumber();

    // Some basic sanity checks
    if (log.name !== 'TokenDelisted') {
        console.log('tokenDelisted - called with a non delisting transaction');
        return false;
    }

    // Read the blockchain to ensure what we are about to do is correct
    const token: Nft = await fetchNFT(tokenId);

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
        console.log(`${log.name} - unable to add the action`);
        return false;
    }

    return true;
}
