import { NextApiResponse } from "next";

import apiRoute from "../handler";

import { HodlAction, ActionTypes } from "../../../models/HodlAction";
import { ethers } from "ethers";
import { getProvider } from "../../../lib/server/connections";
import { nftmarketaddress } from "../../../../config";

import Market from '../../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import { addAction } from "../actions/add";
import { Redis } from '@upstash/redis';
import { NUMBER_OF_CONFIRMATIONS_TO_WAIT_FOR, TRANSACTION_TIMEOUT } from "../../../lib/utils";
import { getTagsForToken } from "../tags";


const route = apiRoute();
const client = Redis.fromEnv()

// returns whether we were successful
const tokenListed = async (log): Promise<boolean> => {
    console.log(`${log.name} - processing log`);
    const { tokenId: tokenIdBN, seller, price: priceInWei } = log.args;

    const price = ethers.utils.formatEther(priceInWei);
    const tokenId = tokenIdBN.toNumber();

    const added = await client.zadd(`market`,
        {
            score: +price,
            member: tokenId
        }
    );

    if (!added) {
        console.log(`${log.name} - unable to add token to market zset, added ===`, added);
        return false;
    }

    const tags = await getTagsForToken(tokenId);

    for (const tag of tags) {
        const added = await client.zadd(`market:${tag}`,
            {
                score: +price,
                member: tokenId
            }
        );

        if (!added) {
            console.log(`${log.name} - unable to add token to market:${tag} zset, added ===`, added);

            return false;
        }
    }

    const listed: HodlAction = {
        timestamp: Date.now(), // TODO: perhaps we can get the timestamp from the transaction confirmation?
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
        console.log(`${log.name} - unable to add the action`);
        return false;
    }

    return true;
}


const tokenDelisted = async (log): Promise<boolean> => {
    console.log(`${log.name} - processing log`);
    const { tokenId: tokenIdBN, seller, name } = log.args;
    const tokenId = tokenIdBN.toNumber();

    const removed = await client.zrem(`market`, tokenId);

    if (!removed) {
        console.log(`${log.name} - unable to remove the token from the  market zset`);
        return false;
    }

    console.log(`${log.name} - getting tags for token`);
    const tags = await getTagsForToken(tokenId);
    console.log(`${log.name} - tags === `, tags);

    for (const tag of tags) {
        const removed = await client.zrem(`market:${tag}`, tokenId);

        if (!removed) {
            console.log(`${log.name} - unable to remove token from market:${tag} zset`);
            return false;
        }
    }

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


// TODO: We should delay in calling this to give the blockchain a chance to confirm the transaction first.
// TODO: Determine how long 5 confirmations will take. (infura suggests every 15 seconds on so)

// TODO: Potentially we might split up some of this into separate 'sub-systems'. 
// i.e. it would be nice if the notifications were separate; as we could then retry JUST them if anything went wrong.

// TODO: We need to lock this down as much as possible. ideally only the queue should be able to call it
route.post(async (req, res: NextApiResponse) => {
    const { hash } = req.body;

    console.log('TRANSACTION HANDLER CALLED');

    if (!req.address) {
        console.log(`blockchain/transaction - endpoint called without credentials`);
        return res.status(503).json({ message: 'unable to process the transaction' });
    }

    const provider = await getProvider();

    // We can't wait very long at all, as this is a serverless function. 
    // There's no point in failing the request if we ARE able to wait though.
    const txReceipt = await provider.waitForTransaction(hash, NUMBER_OF_CONFIRMATIONS_TO_WAIT_FOR, TRANSACTION_TIMEOUT);

    if (txReceipt === null) {
        // TODO: We should (probably) increase the retry interval on each failure.
        // We would (probably) have to record how many attempts we've tried though. (in Redis)
        res.setHeader('Retry-After', 15);
        return res.status(503);
    }

    if (txReceipt.from !== req.address) {
        console.log(`blockchain/transaction - endpoint called with credentials that don't match the transaction`);
        return res.status(400).json({ message: 'bad request' });
    }

    if (txReceipt.to !== nftmarketaddress) {
        console.log(`blockchain/transaction - endpoint called with a transaction that isn't for our contract`);
        return res.status(400).json({ message: 'bad request' });
    }

    const contract = new ethers.Contract(nftmarketaddress, Market.abi, provider);

    if (!txReceipt.logs?.[0]) {
        console.log('blockchain/transaction - unable to retrieve the transaction log');
        return res.status(503);
    }

    const log = contract.interface.parseLog(txReceipt.logs?.[0]);

    let success = false;

    if (log.name === 'TokenListed') {
        success = await tokenListed(log);
    } else if (log.name === 'TokenDelisted') {
        success = await tokenDelisted(log);
    }

    if (success) {
        return res.status(201).json({ message: 'successfully processed the transaction' });
    }

    return res.status(503).json({ message: 'unable to process the transaction' });
});


export default route;
