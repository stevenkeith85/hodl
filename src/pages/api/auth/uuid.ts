import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';

import apiRoute from "../handler";

const client = Redis.fromEnv()
const route = apiRoute();

// TODO: Convert to edge function
export const getUuidForAddress = async (address) => {
  console.log("asking for uuid for :", address)
  const exists = await client.hexists(`user:${address}`, 'uuid');

  let uuid = null;

  if (exists) {
    uuid = await client.hget(`user:${address}`, 'uuid');
  } else {
    uuid = `${Math.floor(Math.random() * 1000000)}`;
    await client.hset(`user:${address}`, {'uuid': uuid});
  }

  return uuid;
}

route.get(async (req: NextApiRequest, res: NextApiResponse) => {  
  const { address } = req.query;

  if (!address) {
    return res.status(200).json({ error: 'No address supplied' });
  }

  const uuid = await getUuidForAddress(address);

  res.status(200).json({uuid});
});


export default route;
