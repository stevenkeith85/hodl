import { NextApiResponse } from "next";
import cookie from 'cookie'
import apiRoute from "../handler";

import { getProvider } from "../../../lib/server/connections";
import { nftmarketaddress } from "../../../../config";

import { Redis } from '@upstash/redis';
import { getAsString } from "../../../lib/utils";

import axios from 'axios';
import { User } from "../../../models/User";

const route = apiRoute();
const client = Redis.fromEnv()

route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const hash = getAsString(req.body.hash);

  const provider = await getProvider();
  const tx = await provider.getTransaction(hash);

  if (tx === null) {
    console.log(`market/transaction - unknown tx`);
    return res.status(400).json({ message: 'bad request' });
  }

  if (tx.from !== req.address) {
    console.log(`market/transaction - user trying to process a transaction they did not create`);
    return res.status(400).json({ message: 'bad request' });
  }

  if (tx.to !== nftmarketaddress) {
    console.log(`market/transaction - user trying to process a transaction that isn't for our contract`);
    return res.status(400).json({ message: 'bad request' });
  }

  const user = await client.hmget<User>(`user:${req.address}`, 'nonce');
  
  if (tx.nonce  <= user.nonce) {
    console.log(`market/transaction - tx.nonce / user.nonce`, tx.nonce, user.nonce);
    console.log(`market/transaction - user trying to process a transaction that is the same or older than the last one we've sent for processing`);
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
    console.log("market/transaction", error)
  }

  return res.status(202).json({ message: 'accepted' });
});


export default route;
