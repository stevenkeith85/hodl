import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';

import apiRoute from "../handler";

import { UserViewModel } from "../../../models/User";
import { getUser } from "../user/[handle]";
import { getAsString } from "../../../lib/getAsString";


const client = Redis.fromEnv()
const route = apiRoute();

// TODO: getFollowers and getFollowing are almost the same pattern. 
// Seems like getting a list of users could be a shared
// function that a few API endpoints could make use of
export const getFollowing = async (address: string, offset: number = 0, limit: number = 10, viewer = null) => {
  try {
    let users: UserViewModel[] = [];
    const total = await client.zcard(`user:${address}:following`);

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

    const addresses: string[] = await client.zrange(`user:${address}:following`, start, stop, { rev: true });
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

  const following = await getFollowing(address, +offset, +limit, req?.address);

  res.status(200).json(following);
});

export default route;
