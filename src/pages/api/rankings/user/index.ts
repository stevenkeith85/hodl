import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';

import apiRoute from "../../handler";
import { UserViewModel } from "../../../../models/User";


import { getUserVMs } from "../../../../lib/database/userVMs";
import { getAsString } from "../../../../lib/getAsString";


const client = Redis.fromEnv()
const route = apiRoute();

// data structures:
//
// ZSET (rankings:user:followers) <address> and their follower count

export const getMostFollowedUsers = async (
  offset: number = 0,
  limit: number = 10,
  viewer: string = null
): Promise<
  {
    items: UserViewModel[],
    next: number,
    total: number
  }> => {

  const total = await client.zcard(`rankings:user:followers:count`);

  if (offset >= total) {
    return {
      items: [],
      next: Number(offset) + Number(limit),
      total: Number(total)
    };
  }

  const addresses: string[] = await client.zrange(`rankings:user:followers:count`, offset, offset + limit - 1, { rev: true });
  const userVMs = await getUserVMs(addresses);
  
  return {
    items: userVMs,
    next: Number(offset) + Number(limit),
    total: Number(total)
  };
}

route.get(async (req, res: NextApiResponse) => {
  const offset = getAsString(req.query.offset);
  const limit = getAsString(req.query.limit);

  if (!offset || !limit) {
      return res.status(400).json({ message: 'Bad Request' });
  }

  const addresses = await getMostFollowedUsers(+offset, +limit, req?.address);

  res.status(200).json(addresses);

});


export default route;
