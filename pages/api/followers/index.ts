import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from "../handler";
import { isValidAddress } from "../../../lib/profile";
import axios from 'axios';
import { getAsString } from "../../../lib/utils";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();


export const getFollowers = async (address: string, offset: number = 0, limit: number = 10) => {
  try {
    const total = await client.zcard(`user:${address}:followers`);

    if (offset >= total) {
      return { items: [], next: Number(total), total: Number(total) };
    }

    const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/user:${address}:followers/${offset}/${offset + limit - 1}/rev`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    })
    const followers = r.data.result


    return { items: followers, next: Number(offset) + Number(followers.length), total: Number(total) };
  } catch (e) {
    return { items: [], next: 0, total: 0 };
  }
}

route.get(async (req: NextApiRequest, res: NextApiResponse) => {  
  const address = getAsString(req.query.address);
  const offset = getAsString(req.query.offset);
  const limit = getAsString(req.query.limit);

  if (!address || !offset || !limit) {
    return res.status(400).json({ message: 'Bad Request' });
  }
  
  const followers = await getFollowers(address, +offset, +limit);
  res.status(200).json(followers);
});

export default route;
