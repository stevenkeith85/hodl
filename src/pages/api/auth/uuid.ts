import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import memoize from 'memoizee';

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

// Memo cleared on login
export const getUuidForAddress = memoize(async (address) => {
  const exists = await client.hexists(`user:${address}`, 'uuid');

  let uuid = null;

  if (exists) {
    uuid = await client.hget(`user:${address}`, 'uuid');
  } else {
    uuid = `${Math.floor(Math.random() * 1000000)}`;
    await client.hset(`user:${address}`, {'uuid': uuid});
  }

  return uuid;
}, {  
  primitive: true, 
  max: 10000, // store 10,000 nicknames
});

route.get(async (req: NextApiRequest, res: NextApiResponse) => {  
  const { address } = req.query;

  if (!address) {
    return res.status(200).json({ error: 'No address supplied' });
  }

  const uuid = await getUuidForAddress(address);

  res.status(200).json({uuid});
});


export default route;
