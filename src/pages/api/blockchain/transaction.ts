import { NextApiResponse } from "next";

import apiRoute from "../handler";

import { HodlAction, ActionTypes } from "../../../models/HodlAction";
import { ethers } from "ethers";
import { getProvider } from "../../../lib/server/connections";
import { nftaddress, nftmarketaddress } from "../../../../config";

import Market from '../../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import { addAction } from "../actions/add";
import { Redis } from '@upstash/redis';
import { ipfsUriToCid, ipfsUriToGatewayUrl, NUMBER_OF_CONFIRMATIONS_TO_WAIT_FOR, TAG_PATTERN, TRANSACTION_TIMEOUT } from "../../../lib/utils";
import { getTagsForToken } from "../tags";
import { LogDescription } from "ethers/lib/utils";
import NFT from '../../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import axios from 'axios';
import { Token } from "../../../models/Token";
import { addTokenToTag } from "../tags/add";
import { format, fromUnixTime } from "date-fns";
import { tokenMinted } from "../../../lib/transactions/tokenMinted";

const route = apiRoute();
const client = Redis.fromEnv()


const getInfuraIPFSAuth = () => {
    const credentials = Buffer.from(process.env.INFURA_IPFS_PROJECT_ID + ':' + process.env.INFURA_IPFS_PROJECT_SECRET).toString('base64');
    var auth = { "Authorization": `Basic ${credentials}` };
    return auth;
};


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


// event TokenListed(
//     address indexed seller,
//     uint256 indexed tokenId,
//     uint256 price
// );
const tokenListed = async (log): Promise<boolean> => {
    console.log(`${log.name} - processing log`);

    const { tokenId: tokenIdBN, seller, price: priceInWei } = log.args;

    const price = ethers.utils.formatEther(priceInWei);
    const tokenId = tokenIdBN.toNumber();

    // UPDATE THE MARKET (MAIN)
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

    // UPDATE THE MARKET (TAGS)
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

    // ADD THE ACTION
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

// event TokenDelisted(
//     address indexed seller, 
//     uint256 indexed tokenId
// );
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
        console.log(`blockchain/transaction - endpoint called with credentials that don't match the transaction`);
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

    // TODO: Split these into their own files
    if (log.name === 'TokenListed') {
        success = await tokenListed(log);
    } else if (log.name === 'TokenDelisted') {
        success = await tokenDelisted(log);
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
