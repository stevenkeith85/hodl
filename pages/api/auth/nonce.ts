// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import memoize from 'memoizee';

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

// Memo cleared on login
export const getNonceForAddress = memoize(async (address) => {
  const exists = await client.hexists(`user:${address}`, 'nonce');

  let nonce = null;

  if (exists) {
    nonce = await client.hget(`user:${address}`, 'nonce');
  } else {
    nonce = `${Math.floor(Math.random() * 1000000)}`;
    await client.hset(`user:${address}`, {'nonce': nonce});
  }

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
