import { NextApiResponse } from "next";
import apiRoute from "../handler";
import { ethers } from "ethers";
import { getProvider } from "../../../lib/server/connections";
import Market from '../../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import { Redis } from '@upstash/redis';
import { NUMBER_OF_CONFIRMATIONS_TO_WAIT_FOR, TRANSACTION_TIMEOUT, validTxHashFormat } from "../../../lib/utils";
import { LogDescription } from "ethers/lib/utils";
import NFT from '../../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { fromUnixTime } from "date-fns";
import { tokenMinted } from "../../../lib/transactions/tokenMinted";
import { tokenListed } from "../../../lib/transactions/tokenListed";
import { tokenDelisted } from "../../../lib/transactions/tokenDelisted";
import { tokenBought } from "../../../lib/transactions/tokenBought";
import { User } from "../../../models/User";

const route = apiRoute();
const client = Redis.fromEnv()


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


// This route processes a transaction that was added to the queue. 
// It must do validation; as things could be added to the queue outside our system. (potentially)
//
// Currently;
// Only authenticated users can call it
// The caller must be the transaction author
// The contract must be one of ours
// The transaction nonce must be higher than the last on we successfully processed
// It must be a valid transaction
//
// We should delay calling this to give the blockchain a chance to update first
//
// The handlers should be as idempotent as possible. 
// Things should be as robust as possible. (we are mostly there; but in some very unlikely scenarios things might not get updated.)
//
// TODO: Potentially we might split up some of this into separate 'sub-systems'. 
// i.e. it would be nice if the notifications were separate; as we could then retry JUST them if anything went wrong.
//
// TODO: If we could lock this down to only the queue dispatcher calling it, that would be nice
route.post(async (req, res: NextApiResponse) => {
    console.log('blockchain/transaction - transaction handler called');

    const { hash } = req.body;
    console.log(`blockchain/transaction - processing ${hash} at ${Date.now()}`);

    if (!validTxHashFormat(hash)) {
        return res.status(400).json({ message: 'bad request' });
      }

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

    if (txReceipt.to !== process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS &&
        txReceipt.to !== process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS) {
        console.log(`blockchain/transaction - endpoint called with a transaction that isn't for our contracts`);
        return res.status(400).json({ message: 'bad request' });
    }

    if (!txReceipt.logs?.[0]) {
        console.log('blockchain/transaction - unable to retrieve the transaction log');
        return res.status(503);
    }

    const tx: ethers.providers.TransactionResponse = await provider.getTransaction(hash);

    const user = await client.hmget<User>(`user:${req.address}`, 'nonce');
  
    console.log("blockchain/transaction - user nonce is ", user?.nonce);
    console.log("blockchain/transaction - tx nonce is ", tx?.nonce);
  
    if (tx.nonce  < user.nonce) {
      console.log(`blockchain/transaction - tx.nonce / user.nonce`, tx.nonce, user.nonce);
      console.log(`blockchain/transaction - user trying to process a transaction that is older than the last one we've sucessfully processed`);
      return res.status(400).json({ message: 'bad request' });
    }

    // TODO: This is just useful for development. We can remove for prod
    // console.log('blockchain/transaction - transaction details');
    // await transactionDetails(hash, provider, txReceipt, tx);

    let contract = null;
    if (txReceipt.to === process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS) {
        contract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, provider);
    } else if (txReceipt.to === process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS) {
        contract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, provider);
    }

    const log: LogDescription = contract.interface.parseLog(txReceipt.logs?.[0]);

    let success = false;

    if (log.name === 'TokenListed') {
        success = await tokenListed(hash, provider, txReceipt, tx);
    } else if (log.name === 'TokenDelisted') {
        success = await tokenDelisted(hash, provider, txReceipt, tx);
    } else if (log.name === 'TokenBought') {
        success = await tokenBought(hash, provider, txReceipt, tx);
    } else if (log.name === 'Transfer') {
        success = await tokenMinted(hash, provider, txReceipt, tx);
    }

    // TODO: Perhaps we should log what transactions were processed, 
    // at what time and whether they were successful
    // Should be helpful if we get support requests
    if (success) {
        console.log('blockchain/transaction - successfully processed transaction - updating nonce');
        await client.hmset<string>(`user:${req.address}`, {
            nonce: `${tx.nonce}`
        });
        
        return res.status(201).json({ message: 'successfully processed the transaction' });
    }

    console.log('blockchain/transaction - unable to process transaction - not updating nonce');
    return res.status(503).json({ message: 'unable to process the transaction' });
});


export default route;
