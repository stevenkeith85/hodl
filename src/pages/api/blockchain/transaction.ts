import { NextApiResponse } from "next";
import apiRoute from "../handler";

import { getProvider } from "../../../lib/server/connections";
import Market from '../../../../smart-contracts/artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import { Redis } from '@upstash/redis';
import { validTxHashFormat } from "../../../lib/utils";

import NFT from '../../../../smart-contracts/artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { tokenMinted } from "../../../lib/transactions/tokenMinted";
import { tokenListed } from "../../../lib/transactions/tokenListed";
import { tokenDelisted } from "../../../lib/transactions/tokenDelisted";
import { tokenBought } from "../../../lib/transactions/tokenBought";
import { User } from "../../../models/User";
import { getAsString } from "../../../lib/getAsString";

import { BaseProvider } from '@ethersproject/providers'
import { TransactionResponse, TransactionReceipt} from '@ethersproject/abstract-provider'
import { LogDescription } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'

const route = apiRoute();
const client = Redis.fromEnv()


// This route processes a transaction that was added to the queue. 
//
// Currently;
// Only authenticated users can call it
// The credentials must match the tx sender
// The contract must be one of ours
// The transaction nonce must be higher than the last on we successfully processed
// It must be a valid transaction
//
// We could delay calling this to give the blockchain a chance to update first. (So that the first attempt is more likely to succeed)
//
// The handlers should be idempotent as any database updates must be atomic
//
// Things should be robust
//
// TODO: Potentially we might split up some of this into separate 'sub-systems'. 
// i.e. it would be nice if the notifications were separate; as we could then retry JUST them if anything went wrong.
//
route.post(async (req, res: NextApiResponse) => {

    if (req.query.secret !== process.env.ZEPLO_SECRET) {
        console.log("blockchain/transaction - endpoint not called via our message queue");
        return res.status(401).json({ message: 'unauthenticated' });
    }

    const hash = getAsString(req.body.hash);

    if (!validTxHashFormat(hash)) {
        console.log(`blockchain/transaction - invalid hash format - ${hash}`);
        return res.status(400).json({ message: 'bad request' });
    }

    if (!req.address) {
        console.log(`blockchain/transaction - endpoint called without credentials`);
        return res.status(400).json({ message: 'unable to process the tx' });
    }

    const firstHashToBeProcessed = await client.zrange(`user:${req.address}:txs:pending`, 0, 0);
    
    if (hash !== firstHashToBeProcessed[0]) {
        console.log(`blockchain/transaction - cannot process this tx until we successfully process the early ones`, hash, firstHashToBeProcessed[0]);
        return res.status(400).json({ message: 'tx with a lower nonce still in the queue' });
    }

    const provider: BaseProvider = await getProvider();

    // We can't wait very long at all, as this is a serverless function. 
    // There's no point in failing the request if we ARE able to wait though.
    const txReceipt: TransactionReceipt = await provider.waitForTransaction(
        hash,
        +process.env.NUMBER_OF_CONFIRMATIONS_TO_WAIT_FOR,
        +process.env.TRANSACTION_TIMEOUT,
    );

    if (txReceipt === null) {
        console.log(`blockchain/transaction - tx not confirmed on the blockchain at the moment`);
        return res.status(503);
    }

    if (txReceipt.byzantium && txReceipt.status === 0) {
        console.log('blockchain/transaction - The tx was reverted');
        return res.status(503);
    }

    if (txReceipt.from !== req.address) {
        console.log(`blockchain/transaction - credentials do not match the tx sender`);
        return res.status(400).json({ message: 'bad request' });
    }

    if (txReceipt.to !== process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS &&
        txReceipt.to !== process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS) {
        console.log(`blockchain/transaction - tx is not for our contracts`);
        return res.status(400).json({ message: 'bad request' });
    }

    if (!txReceipt.logs?.[0]) {
        console.log('blockchain/transaction - unable to retrieve the transaction log');
        return res.status(503);
    }

    const tx: TransactionResponse = await provider.getTransaction(hash);

    const user = await client.hmget<User>(`user:${req.address}`, 'nonce');

    if (tx.nonce <= user.nonce) {
        console.log(`blockchain/transaction - tx nonce older than last one we successfully processed. tx nonce: ${tx.nonce}, user nonce: ${user.nonce}`);
        return res.status(400).json({ message: 'bad request' });
    }    

    let contract = null;
    if (txReceipt.to === process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS) {
        contract = new Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, provider);
    } else if (txReceipt.to === process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS) {
        contract = new Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, provider);
    }

    // if there are logs unknown to the ABI, then parseLog throws. 
    // we only care about logs in the ABI though; so we just ignore the exception
    const parsedLogs = [];
    txReceipt.logs.forEach(log => {
        try {
            const parsedLog = contract.interface.parseLog(log);
            parsedLogs.push(parsedLog);
        } catch (e) {
            console.log(`blockchain/transaction - parse log error - ${e}`)
        }
    });

    // TODO: Parsing the first one known to the ABI should be ok? (Potentially we might need to find one of the logs 'of interest')
    const log: LogDescription = parsedLogs[0];

    let action = null;

    if (log.name === 'TokenListed') {
        action = await tokenListed(hash, tx, log, req);
    } else if (log.name === 'TokenDelisted') {
        action = await tokenDelisted(hash, tx, log, req);
    } else if (log.name === 'TokenBought') {
        action = await tokenBought(hash, tx, log, req);
    } else if (log.name === 'Transfer') {
        action = await tokenMinted(hash, provider, tx, log, req);
    }

    if (action) {
        return res.status(200).json(action);
    }

    return res.status(503).json({ message: 'unable to process the transaction' });
});


export default route;
