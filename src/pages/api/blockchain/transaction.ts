import { NextApiResponse } from "next";

import apiRoute from "../handler";

import { HodlAction, ActionTypes } from "../../../models/HodlAction";
import { ethers } from "ethers";
import { getProvider } from "../../../lib/server/connections";
import { nftaddress, nftmarketaddress } from "../../../../config";

import Market from '../../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import { addAction } from "../actions/add";
import { Redis } from '@upstash/redis';
import { NUMBER_OF_CONFIRMATIONS_TO_WAIT_FOR, TRANSACTION_TIMEOUT } from "../../../lib/utils";
import { getTagsForToken } from "../tags";
import { LogDescription } from "ethers/lib/utils";
import NFT from '../../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { fromUnixTime } from "date-fns";
import { tokenMinted } from "../../../lib/transactions/tokenMinted";
import { tokenListed } from "../../../lib/transactions/tokenListed";
import { tokenDelisted } from "../../../lib/transactions/tokenDelisted";

const route = apiRoute();
const client = Redis.fromEnv()


// TODO: At the moment, we have an all or unknown state system. We want this to be more reliable, and potentially able to run
// independently from each other

// event TokenBought(
//     address indexed buyer,
//     address indexed seller,
//     uint256 indexed tokenId,
//     uint256 price
// );
const addActionWhenTokenBought = async (log: LogDescription): Promise<boolean> => {
    console.log(`${log.name} - logging action`);
    const { buyer, seller, tokenId: tokenIdBN, price: priceInWei } = log.args;

    const price = ethers.utils.formatEther(priceInWei);
    const tokenId = tokenIdBN.toNumber();

    const bought: HodlAction = {
        timestamp: Date.now(), // TODO: perhaps we can get the timestamp of the transaction confirmation?
        action: ActionTypes.Bought,
        subject: buyer,
        object: "token",
        objectId: tokenId,
        metadata: {
            price
        }
    };

    console.log(`${log.name} - adding action `, bought);
    const success = await addAction(bought);

    if (!success) {
        console.log(`${log.name} - unable to add the action`);
        return false;
    }

    return true;
}

const updateMarketWhenTokenBought = async (log: LogDescription) => {
    console.log(`${log.name} - updating market`);
    const { buyer, seller, tokenId: tokenIdBN, price: priceInWei } = log.args;

    const price = ethers.utils.formatEther(priceInWei);
    const tokenId = tokenIdBN.toNumber();

    const removed = await client.zrem(`market`, tokenId);

    if (!removed) {
        console.log(`${log.name} - unable to remove the token from the market zset`);
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
}

// event TokenBought(
//     address indexed buyer,
//     address indexed seller,
//     uint256 indexed tokenId,
//     uint256 price
// );
const tokenBought = async (log: LogDescription): Promise<boolean> => {

    const marketUpdated = await updateMarketWhenTokenBought(log)
    console.log(`${log.name} - market updated === ${marketUpdated}`);
    const actionAdded = await addActionWhenTokenBought(log);

    return marketUpdated && actionAdded;
}




const transactionDetails = async (hash,
    provider: ethers.providers.BaseProvider, 
    txReceipt: ethers.providers.TransactionReceipt,
    tx: ethers.providers.TransactionResponse) => {
    console.log('hash', hash);
    console.log('status', txReceipt.byzantium && txReceipt.status === 1 ? 'success' : 'reverted');
    console.log('block', txReceipt.blockNumber);
    console.log('confirmations', txReceipt.confirmations);
    
    console.log('from', txReceipt.from);
    console.log('to', txReceipt.to);
    
    console.log('value', ethers.utils.formatEther(tx.value));
    console.log('total gas fee', ethers.utils.formatEther(txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice)));

    console.log('total cost to sender', ethers.utils.formatEther(txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice).add(tx.value)));
    
    console.log('transaction nonce', tx.nonce);

    const block = await provider.getBlock(tx.blockHash);
    console.log('timestamp', fromUnixTime(block.timestamp));

}

// TODO: We should delay in calling this to give the blockchain a chance to confirm the transaction first.
// TODO: Determine how long 5 confirmations will take. (infura suggests every 15 seconds on so)

// TODO: Potentially we might split up some of this into separate 'sub-systems'. 
// i.e. it would be nice if the notifications were separate; as we could then retry JUST them if anything went wrong.

// TODO: We need to lock this down as much as possible. ideally only the queue should be able to call it

// This route should process transactions added to our queue.
// We want things to be idempotent, and to always leave the system in a good state.
// Even though we will only send the correct transactions, that would not
// stop a user sending one directly to the queue (at the moment); so we need to safeguard against that
// perhaps we can do something to ensure only our 'add to queue' endpoint can call this
//
// have I processed this transaction before?
// did i manage to update the market
route.post(async (req, res: NextApiResponse) => {
    console.log('TRANSACTION HANDLER CALLED');

    const { hash } = req.body;

    if (!req.address) {
        console.log(`blockchain/transaction - endpoint called without credentials`);
        return res.status(503).json({ message: 'unable to process the transaction' });
    }

    const provider: ethers.providers.BaseProvider = await getProvider();

    // We can't wait very long at all, as this is a serverless function. 
    // There's no point in failing the request if we ARE able to wait though.
    const txReceipt: ethers.providers.TransactionReceipt = await provider.waitForTransaction(
        hash, 
        NUMBER_OF_CONFIRMATIONS_TO_WAIT_FOR, 
        TRANSACTION_TIMEOUT
    );

    // TODO: We might repeat these checks in the handler's as well
    if (txReceipt === null) {
        // TODO: We should (probably) increase the retry interval on each failure.
        // We would (probably) have to record how many attempts we've tried though. (in Redis)
        res.setHeader('Retry-After', 15);
        return res.status(503);
    }

    if (txReceipt.byzantium && txReceipt.status === 0) {
        console.log('blockchain/transaction - The transaction was reverted');
        return res.status(503);
    }

    if (txReceipt.from !== req.address) {
        console.log(`blockchain/transaction - user trying to process a transaction they did not create`);
        return res.status(400).json({ message: 'bad request' });
    }

    if (txReceipt.to !== nftmarketaddress &&
        txReceipt.to !== nftaddress) {
        console.log(`blockchain/transaction - endpoint called with a transaction that isn't for our contracts`);
        return res.status(400).json({ message: 'bad request' });
    }

    if (!txReceipt.logs?.[0]) {
        console.log('blockchain/transaction - unable to retrieve the transaction log');
        return res.status(503);
    }

    const tx: ethers.providers.TransactionResponse = await provider.getTransaction(hash);

    // TODO: This is just useful for development. We can remove for prod
    console.log('blockchain/transaction - transaction details');
    await transactionDetails(hash, provider, txReceipt, tx);

    // TODO: Review / improve the dispatcher code
    let contract = null;
    if (txReceipt.to === nftmarketaddress) {
        contract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
    } else if (txReceipt.to === nftaddress) {
        contract = new ethers.Contract(nftaddress, NFT.abi, provider);
    }

    const log: LogDescription = contract.interface.parseLog(txReceipt.logs?.[0]);

    let success = false;

    // TODO: Split these into their own files (in progress)
    if (log.name === 'TokenListed') {
        success = await tokenListed(hash, provider, txReceipt, tx);
    } else if (log.name === 'TokenDelisted') {
        success = await tokenDelisted(hash, provider, txReceipt, tx);
    } else if (log.name === 'TokenBought') {
        success = await tokenBought(log);
    } else if (log.name === 'Transfer') {
        success = await tokenMinted(hash, provider, txReceipt, tx);
    }

    if (success) {
        return res.status(201).json({ message: 'successfully processed the transaction' });
    }

    return res.status(503).json({ message: 'unable to process the transaction' });
});


export default route;
