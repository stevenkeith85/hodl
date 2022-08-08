import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import axios from 'axios';
import { getAsString } from "../../../lib/utils";
import { User } from "../../../models/User";
import { getUser } from "../user/[handle]";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();


export const getFollowers = async (address: string, offset: number = 0, limit: number = 10)
  : Promise<{ items: User[], next: number, total: number } | null> => {
  try {
    let users: User[] = [];
    const total = await client.zcard(`user:${address}:followers`);

    if (offset >= total) {
      return {
        items: users,
        next: Number(total),
        total: Number(total)
      };
    }

    const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/user:${address}:followers/${offset}/${offset + limit - 1}/rev`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    })

    const addresses: string[] = r.data.result;

    console.log('followers', addresses)
    const promises = addresses.map(address => getUser(address));
    console.log('promises', promises)
    users = await Promise.all(promises);
    console.log('bar')
    console.log('USERS', users)

    return { items: users, next: Number(offset) + Number(users.length), total: Number(total) };
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
