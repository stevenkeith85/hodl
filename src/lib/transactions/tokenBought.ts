import { HodlAction, ActionTypes } from "../../models/HodlAction";
import { ethers } from "ethers";
import { Redis } from '@upstash/redis';
import { addAction } from "../../pages/api/actions/add";
import Market from '../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import { getTagsForToken } from "../../pages/api/tags";
import { Nft } from "../../models/Nft";
import { fetchNFT } from "../../pages/api/nft/[tokenId]";

const client = Redis.fromEnv()


export const tokenBought = async (
    hash: string, // check valid address?
    provider: ethers.providers.BaseProvider,
    txReceipt: ethers.providers.TransactionReceipt,
    tx: ethers.providers.TransactionResponse
): Promise<boolean> => {
    console.log(`tokenBought - processing tx`);

    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, provider);

    // event TokenBought(
    //     address indexed buyer,
    //     address indexed seller,
    //     uint256 indexed tokenId,
    //     uint256 price
    // );
    const log: ethers.utils.LogDescription = contract.interface.parseLog(txReceipt.logs?.[0]);

    if (log.name !== 'TokenBought') {
        console.log('tokenBought - called with a non buying transaction');
        return false;
    }

    const { buyer, seller, tokenId: tokenIdBN, price: priceInWei } = log.args;

    const price = ethers.utils.formatEther(priceInWei);
    const tokenId = tokenIdBN.toNumber();

    // Read the blockchain to ensure what we are about to do is correct
    const token: Nft = await fetchNFT(tokenId);

    if (token.forSale) {
        console.log('tokenBought - token is still for sale according to the blockchain - not delisting from market');
        return;
    }

    const removed = await client.zrem(`market`,
        tokenId
    );

    if (!removed) {
        console.log(`tokenBought - token is not on the market`);
        return false;
    }

    const tags = await getTagsForToken(tokenId);

    for (const tag of tags) {
        const removed = await client.zrem(`market:${tag}`, tokenId);

        if (!removed) {
            console.log(`tokenBought - unable to remove token from market:${tag} zset`);
            // we do not abort here as we might as well try adding the other tags
            // TODO: Better fault tolerance here
        }
    }

    // use the block timestamp for accuracy
    const block = await provider.getBlock(tx.blockHash);

    const bought: HodlAction = {
        timestamp: block.timestamp,
        action: ActionTypes.Bought,
        subject: buyer,
        object: "token",
        objectId: tokenId,
        metadata: {
            price,
            seller
        }
    };

    const success = await addAction(bought);

    if (!success) {
        console.log(`tokenBought - unable to add the action`);
        return false;
    }

    return true;
}
