import { HodlAction, ActionTypes } from "../../models/HodlAction";
import { ethers } from "ethers";
import { Redis } from '@upstash/redis';
import { addAction } from "../../pages/api/actions/add";
import Market from '../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import { getTagsForToken } from "../../pages/api/tags";
import { getFullToken } from "../../pages/api/contracts/mutable-token/[tokenId]";
import { FullToken } from "../../models/Nft";

const client = Redis.fromEnv()


export const tokenListed = async (
    hash: string, // check valid address?
    provider: ethers.providers.BaseProvider,
    txReceipt: ethers.providers.TransactionReceipt,
    tx: ethers.providers.TransactionResponse
): Promise<boolean> => {
    console.log(`tokenListed - processing tx`);

    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, provider);

    // event TokenListed(
    //     address indexed seller,
    //     uint256 indexed tokenId,
    //     uint256 price
    // );
    const log: ethers.utils.LogDescription = contract.interface.parseLog(txReceipt.logs?.[0]);

    const { tokenId: tokenIdBN, seller, price: priceInWei } = log.args;

    const price = ethers.utils.formatEther(priceInWei);
    const tokenId = tokenIdBN.toNumber();

    // Some basic sanity checks
    if (log.name !== 'TokenListed') {
        console.log('tokenListed - called with a non listing transaction');
        return false;
    }

    if (priceInWei === ethers.constants.Zero) {
        // The smart contract should prevent this, so this is more of an assertion
        console.log('tokenListed - somehow able to list a token for 0 - not adding');
        return false;
    }

    // Read the blockchain to ensure what we are about to do is correct
    const token: FullToken = await getFullToken(tokenId, true);

    if (!token.forSale) {
        console.log('tokenListed - token is not for sale according to the blockchain - not listing on market');
        return;
    }

    if (token.price !== price) {
        console.log('tokenListed - token is listed at a different price on the blockchain to the provided tx; strange! - not listing on market');
        return;
    }

    const added = await client.zadd(`market`,
        { nx: true },
        {
            score: +price,
            member: tokenId
        }
    );

    if (!added) {
        console.log('tokenListed - token already listed on market, aborting');
        return false;
    }

    // UPDATE THE MARKET (TAGS)
    const tags = await getTagsForToken(tokenId);
    console.log("tokenListed - adding market tags", tags)

    for (const tag of tags) {
        const added = await client.zadd(`market:${tag}`,
            { nx: true },
            {
                score: +price,
                member: tokenId
            }
        );

        if (!added) {
            console.log(`tokenListed - unable to add token to market:${tag} zset`);
            // we do not abort here as we might as well try adding the other tags
            // TODO: Better fault tolerance here
        }
    }

    // use the block timestamp for accuracy
    const block = await provider.getBlock(tx.blockHash);

    const listed: HodlAction = {
        timestamp: block.timestamp,
        action: ActionTypes.Listed,
        subject: seller,
        object: "token",
        objectId: tokenId,
        metadata: {
            price
        }
    };

    const success = await addAction(listed);

    if (!success) {
        console.log(`tokenListed - unable to add the action`);
        return false;
    }

    return true;
}
