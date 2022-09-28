import { NextApiResponse } from "next";
import cookie from 'cookie'
import apiRoute from "../handler";

import { getProvider } from "../../../lib/server/connections";
import { nftaddress, nftmarketaddress } from "../../../../config";

import { Redis } from '@upstash/redis';
import { getAsString, validTxHashFormat } from "../../../lib/utils";

import axios from 'axios';
import { User } from "../../../models/User";

import { QueueClient } from "@serverlessq/nextjs/dist/queue/queue-client";

const route = apiRoute();
const client = Redis.fromEnv()

// This route decides if we should add something to the queue
//
// Currently;
// Only authenticated users can call it
// The caller must be the transaction author
// The contract must be one of ours
// The transaction nonce must be higher than the last one we successfully processed
// It must be a valid transaction

route.post(async (req, res: NextApiResponse) => {
  console.log('TRANSACTION QUEUER CALLED');

  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const hash = getAsString(req.body.hash);

  if (!validTxHashFormat(hash)) {
    return res.status(400).json({ message: 'bad request' });
  }

  const provider = await getProvider();
  const tx = await provider.getTransaction(hash);

  if (tx === null) {
    console.log(`queue/transaction - unknown tx`);
    return res.status(400).json({ message: 'bad request' });
  }

  if (tx.from !== req.address) {
    console.log(`queue/transaction - user trying to process a transaction they did not create`);
    return res.status(400).json({ message: 'bad request' });
  }

  if (tx.to !== nftmarketaddress && tx.to !== nftaddress) {
    console.log(`queue/transaction - user trying to process a transaction that isn't for our contract`);
    return res.status(400).json({ message: 'bad request' });
  }

  const user = await client.hmget<User>(`user:${req.address}`, 'nonce', 'txQueueId');

  console.log("queue/transaction - user nonce is ", user?.nonce);
  console.log("queue/transaction - tx nonce is ", tx?.nonce);

  if (tx.nonce <= user.nonce) {
    console.log(`queue/transaction - tx.nonce / user.nonce`, tx.nonce, user.nonce);
    console.log(`queue/transaction - user trying to process a transaction that is older than the last one we've sent for processing`);
    return res.status(400).json({ message: 'bad request' });
  }

  // // Create or get the users tx queue
  // // TODO: If this is a little slow, we could just do it at login and store the queue id in the user hash
  // const queueClient = new QueueClient();
  // const queue = await queueClient.createOrGetQueue(`tx:${req.address}`);

  // console.log('market/transaction - created queue', JSON.stringify(queue, null, 2))


  const handlerPath = `api/blockchain/transaction`;
  const url = `https://api.serverlessq.com?id=${user?.txQueueId}&target=${process.env.MESSAGE_HANDLER_HOST}/${handlerPath}`;

  const { accessToken, refreshToken } = req.cookies;
  try {
    const r = await axios.post(
      url,
      { hash },
      {
        withCredentials: true,
        headers: {
          "Accept": "application/json",
          "x-api-key": process.env.SERVERLESSQ_API_TOKEN,
          "Content-Type": "application/json",
          "Cookie": `refreshToken=${refreshToken}; accessToken=${accessToken}`
        }
      }
    );
  } catch (error) {
    console.log("queue/transaction", error)
  }

  return res.status(202).json({ message: 'accepted' });
});


export default route;
