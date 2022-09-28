import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import { getAsString } from "../../../lib/utils";
import { UserViewModel } from "../../../models/User";
import { getUser } from "../user/[handle]";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();


export const getFollowers = async (address: string, offset: number = 0, limit: number = 10, viewer: string =null)
  : Promise<{ items: UserViewModel[], next: number, total: number } | null> => {
  try {
    let users: UserViewModel[] = [];
    const total = await client.zcard(`user:${address}:followers`);

    if (offset >= total) {
      return {
        items: users,
        next: Number(total),
        total: Number(total)
      };
    }

    const addresses : string [] = await client.zrange(`user:${address}:followers`, offset, offset + limit - 1, { rev: true });

    const promises = addresses.map(address => getUser(address, viewer));
    
    users = await Promise.all(promises);

    return { items: users, next: Number(offset) + Number(users.length), total: Number(total) };
  } catch (e) {
    return { items: [], next: 0, total: 0 };
  }
}

route.get(async (req, res: NextApiResponse) => {
  const address = getAsString(req.query.address);
  const offset = getAsString(req.query.offset);
  const limit = getAsString(req.query.limit);

  if (!address || !offset || !limit) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const followers = await getFollowers(address, +offset, +limit, req.address);
  res.status(200).json(followers);
});

export default route;
