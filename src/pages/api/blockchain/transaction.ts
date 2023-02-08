import { NextApiResponse } from "next";
import apiRoute from "../handler";

import { getProvider } from "../../../lib/server/connections";
import Market from '../../../../smart-contracts/artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import { Redis } from '@upstash/redis';
import { validTxHashFormat } from "../../../lib/utils";
import { validAddressFormat } from "../../../lib/validAddressFormat";

import NFT from '../../../../smart-contracts/artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { tokenMinted } from "../../../lib/transactions/tokenMinted";
import { tokenListed } from "../../../lib/transactions/tokenListed";
import { tokenDelisted } from "../../../lib/transactions/tokenDelisted";
import { tokenBought } from "../../../lib/transactions/tokenBought";
import { User } from "../../../models/User";
import { getAsString } from "../../../lib/getAsString";

import { BaseProvider } from '@ethersproject/providers'
import { TransactionResponse, TransactionReceipt } from '@ethersproject/abstract-provider'
import { LogDescription } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'
import { updateTransactionRecords } from "../../../lib/transactions/updateTransactionRecords";
import { zScore } from "../../../lib/database/rest/zScore";
import { zCard } from "../../../lib/database/rest/zCard";

import BiconomyForwarder from "../../../lib/abis/BiconomyForwarder.json"
import { Interface } from "@ethersproject/abi";
import { getExecuteEIP712Data } from "../market/getPersonalSignData";

const route = apiRoute();
const client = Redis.fromEnv()


// This route processes a transaction that was added to the queue. 
//
// The handlers should be idempotent in case we re-run the same tx.
// We try to avoid that though
//
// TODO: 4XX upwards will cause a zeplo retry. Do not retry things that will fail again
route.post(async (req, res: NextApiResponse) => {

    // This must be called via the queue
    if (req.query.secret !== process.env.ZEPLO_SECRET) {
        console.log("blockchain/transaction - endpoint not called via our message queue");
        return res.status(401).json({ message: 'unauthenticated' });
    }

    // With a valid hash
    const hash = getAsString(req.body.hash);
    if (!validTxHashFormat(hash)) {
        console.log(`blockchain/transaction - invalid hash format - ${hash}`);
        return res.status(400).json({ message: 'bad request' });
    }

    // And a valid address
    const address = getAsString(req.body.address);
    if (!validAddressFormat(address)) {
        console.log(`blockchain/transaction - endpoint called without an address`);
        return res.status(400).json({ message: 'Bad request' });
    }

    // which is a user of the system
    const isValidUser = await zScore('users', `${address}`);
    if (isValidUser === null) {
        console.log(`blockchain/transaction - asked to process a transaction for an invalid user address`);
        return res.status(400).json({ message: 'Bad request' });
    }

    // There wont often be a queue of txs, so do a zcard
    const numberOfPendingTxs = await zCard(`user:${address}:txs:pending`);

    if (Number(numberOfPendingTxs) > 0) {
        // if there are multiple txs waiting to process we must do them in the correct order
        const firstHashToBeProcessed = await client.zrange(`user:${address}:txs:pending`, 0, 0);
        if (hash !== firstHashToBeProcessed[0]) {
            console.log(`blockchain/transaction - cannot process this tx until we successfully process the early ones`, hash, firstHashToBeProcessed[0]);
            return res.status(400).json({ message: 'bad request' });
        }
    }

    // Wait for a short time for the tx to be confirmed on the blockchain. 
    // We can only wait a short time due to this being a serverless function.
    const provider: BaseProvider = await getProvider();
    const txReceipt: TransactionReceipt = await provider.waitForTransaction(
        hash,
        +process.env.NUMBER_OF_CONFIRMATIONS_TO_WAIT_FOR,
        +process.env.TRANSACTION_TIMEOUT,
    );

    // if the transaction is still not confirmed on the blockchain after the timeout period; we exit and let the message queue retry later
    if (txReceipt === null) {
        console.log(`blockchain/transaction - tx not confirmed on the blockchain at the moment`);
        return res.status(503);
    }

    const tx: TransactionResponse = await provider.getTransaction(hash);
    
    let from = tx.from;
    let to = tx.to;
    let nonce = tx.nonce;

    const isMetaTx = to === process.env.NEXT_PUBLIC_BICONOMY_FORWARDER_ADDRESS;
    if (isMetaTx) {
      ({ from, to, nonce } = getExecuteEIP712Data(tx));
    }

    if (from !== address) {
        console.log(`blockchain/transaction - credentials do not match the tx sender`);
        return res.status(400).json({ message: 'bad request' });
    }

    if (
        to !== process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS &&
        to !== process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS) {
        console.log(`blockchain/transaction - tx is not for our contracts`);
        return res.status(400).json({ message: 'bad request' });
    }

    const user = await client.hmget<User>(`user:${address}`, 'nonce');

    if (!isMetaTx && tx.nonce <= user.nonce) {
        console.log(`blockchain/transaction - tx nonce older than last one we successfully processed. tx nonce: ${tx.nonce}, user nonce: ${user.nonce}`);
        return res.status(400).json({ message: 'bad request' });
    }


    // If the transaction was reverted; we can update our records and return now
    if (txReceipt.byzantium &&
        txReceipt.status === 0) {
        console.log('blockchain/transaction - The tx was reverted');

        const recordsUpdated = await updateTransactionRecords(address, nonce, hash, isMetaTx);
        if (!recordsUpdated) {
            return res.status(503);
        }

        // We pass an empty action; which will result in an early exit in the action step of this zeplo pipeline
        return res.status(200).json({});
    }

    let contract = null;
    if (to === process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS) {
        contract = new Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, provider);
    } else if (to === process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS
    ) {
        contract = new Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, provider);
    }

    if (!txReceipt.logs?.[0]) {
        console.log('blockchain/transaction - unable to retrieve the transaction log');
        return res.status(503);
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
        action = await tokenListed(hash, tx, log, address);
    } else if (log.name === 'TokenDelisted') {
        action = await tokenDelisted(hash, tx, log, address);
    } else if (log.name === 'TokenBought') {
        action = await tokenBought(hash, tx, log, address);
    } else if (log.name === 'Transfer') {
        action = await tokenMinted(hash, provider, tx, log, address);
    }

    if (action) {
        return res.status(200).json(action);
    }

    return res.status(503).json({ message: 'unable to process the transaction' });
});


export default route;
