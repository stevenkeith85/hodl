// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import apiRoute from "./handler";
import memoize from 'memoizee';

dotenv.config({ path: '../.env' })

const route = apiRoute();

// Memo cleared on login
export const getNonceForAddress = memoize(async (address) => {
  console.log("CALLING REDIS TO GET NONCE FOR ADDRESS", address);
  const client = new Redis(process.env.REDIS_CONNECTION_STRING);
  const exists = await client.hexists(`user:${address}`, 'nonce');

  let nonce = null;

  if (exists) {
    nonce = await client.hget(`user:${address}`, 'nonce');
  } else {
    nonce = `${Math.floor(Math.random() * 1000000)}`;
    await client.hset(`user:${address}`, 'nonce', nonce);
  }

  await client.quit();

  return nonce;
}, {  
  primitive: true, 
  max: 10000, // store 10,000 nicknames
});

route.get(async (req: NextApiRequest, res: NextApiResponse) => {  
  const { address } = req.query;

  if (!address) {
    return res.status(200).json({ error: 'No address supplied' });
  }

  const nonce = await getNonceForAddress(address);

  res.status(200).json({nonce});
});


export default route;
