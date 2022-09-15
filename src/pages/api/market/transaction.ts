import { NextApiResponse } from "next";
import cookie from 'cookie'
import apiRoute from "../handler";

import { getProvider } from "../../../lib/server/connections";
import { nftaddress, nftmarketaddress } from "../../../../config";

import { Redis } from '@upstash/redis';
import { getAsString } from "../../../lib/utils";

import axios from 'axios';
import { User } from "../../../models/User";

const route = apiRoute();
const client = Redis.fromEnv()

// This route should decide if we add something to the queue
route.post(async (req, res: NextApiResponse) => {
  console.log('TRANSACTION QUEUER CALLED');

  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const hash = getAsString(req.body.hash);

  const provider = await getProvider();
  const tx = await provider.getTransaction(hash);

  if (tx === null) {
    console.log(`queue/transaction - unknown tx`);
    return res.status(400).json({ message: 'bad request' });
  }

  // TODO: Add this back in; we've just commented it out for testing the robustness of the other endpoint at the moment
  // if (tx.from !== req.address) {
  //   console.log(`queue/transaction - user trying to process a transaction they did not create`);
  //   return res.status(400).json({ message: 'bad request' });
  // }

  if (tx.to !== nftmarketaddress && tx.to !== nftaddress) {
    console.log(`queue/transaction - user trying to process a transaction that isn't for our contract`);
    return res.status(400).json({ message: 'bad request' });
  }

  // TODO: This is a little basic. We really want to ensure we do not process any user transactions out of order
  // We might need to store which transactions we've handled (or even just the latest one), and consult the blockchain to see the expected order
  // We could potentially just add the missing ones to the queue in the correct order, and this one at the end
  // Given a bit of time may have passed since we 'lost' transactions; we might skip the intermediary notifications
  //
  // This whole scenario should hopefully never happen; but best to be correct in case it does

  // We also would like 're-running' transactions to be idempotent. we could do this by consulting our log of what was handled.
  // add to market, send notification, etc
  const user = await client.hmget<User>(`user:${req.address}`, 'nonce');
  
  console.log("queue/transaction - user nonce is ", user?.nonce);
  console.log("queue/transaction - tx nonce is ", tx?.nonce);

  if (tx.nonce  < user.nonce) {
    console.log(`queue/transaction - tx.nonce / user.nonce`, tx.nonce, user.nonce);
    console.log(`queue/transaction - user trying to process a transaction that is older than the last one we've sent for processing`);
    return res.status(400).json({ message: 'bad request' });
  }

  // TODO: Switch to using ServerlessQs SDK, as it has support for overriding for localhost, etc
  // TODO: One message queue per address (if possible). Programatically create these
  const handlerPath = `api/blockchain/transaction`;
  const url = `https://api.serverlessq.com?id=${process.env.SERVERLESSQ_ID}&target=${process.env.NGROK_TUNNEL}/${handlerPath}`;

  const { accessToken, refreshToken } = req.cookies;
  try {
    const r = await axios.post(
      url,
      { hash },
      {
        withCredentials: true,
        headers: {
          "Accept": "application/json",
          "x-api-key": process.env.SERVERLESSQ_API_KEY,
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
