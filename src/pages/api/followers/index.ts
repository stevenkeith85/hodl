import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';

import apiRoute from "../handler";

import { UserViewModel } from "../../../models/User";
import { getUser } from "../user/[handle]";
import { getAsString } from "../../../lib/getAsString";


const client = Redis.fromEnv()
const route = apiRoute();


// Use this if you only need an address, as it will be much faster
export const getFollowersAddresses = async (
  address: string,
  offset: number = 0,
  limit: number = 10,
  viewer: string = null)
  : Promise<{
    items: string[],
    next: number,
    total: number
  }> => {
  try {
    const total = await client.zcard(`user:${address}:followers`);

    const followers: string [] = [];

    // ZRANGE: Out of range indexes do not produce an error.
    // So we need to check here and return if we are about to do an out of range search
    if (offset >= total) {
      return {
        items: followers,
        next: Number(offset) + Number(limit),
        total: Number(total)
      };
    }

    const start = offset;
    const stop = offset + limit - 1;

    const addresses: string[] = await client.zrange(`user:${address}:followers`, start, stop, { rev: true });
    
    return {
      items: addresses,
      next: Number(offset) + Number(limit),
      total: Number(total)
    };
  } catch (e) {
    return {
      items: [],
      next: 1,
      total: 0
    };
  }
}

// Use this if you NEED a UserViewModel
// NB: It will obviously be slower
export const getFollowers = async (
  address: string,
  offset: number = 0,
  limit: number = 10,
  viewer: string = null)
  : Promise<{
    items: UserViewModel[],
    next: number,
    total: number
  } |
    null> => {
  try {
    let users: UserViewModel[] = [];
    const total = await client.zcard(`user:${address}:followers`);

    // ZRANGE: Out of range indexes do not produce an error.
    // So we need to check here and return if we are about to do an out of range search
    if (offset >= total) {
      return {
        items: users,
        next: Number(offset) + Number(limit),
        total: Number(total)
      };
    }

    const start = offset;
    const stop = offset + limit - 1;

    const addresses: string[] = await client.zrange(`user:${address}:followers`, start, stop, { rev: true });
    const promises = addresses.map(address => getUser(address, viewer));
    users = await Promise.all(promises);

    return {
      items: users,
      next: Number(offset) + Number(limit),
      total: Number(total)
    };
  } catch (e) {
    return {
      items: [],
      next: 1,
      total: 0
    };
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

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
  res.status(200).json(followers);
});

export default route;
