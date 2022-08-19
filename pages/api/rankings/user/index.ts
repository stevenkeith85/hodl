import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import axios from 'axios'
import apiRoute from "../../handler";
import { ActionSet, HodlAction } from "../../../../models/HodlAction";
import { User, UserViewModel } from "../../../../models/User";
import { getUser } from "../../user/[handle]";
import { getAsString } from "../../../../lib/utils";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

// data structures:
//
// ZSET (rankings:user:followers) <address> and their follower count -> TODO: Change to rankings:user:followers:count

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

  const total = await client.zcard(`rankings:user:followers`);

  if (offset >= total) {
    return {
      items: [],
      next: Number(total),
      total: Number(total)
    };
  }

  const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/rankings:user:followers/${offset}/${offset + limit - 1}/rev`, {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
    }
  })

  const addresses: string[] = r.data.result;
  const promises = addresses.map(address => getUser(address, viewer));
  const users: UserViewModel[] = await Promise.all(promises);
  
  return {
    items: users,
    next: Number(offset) + Number(addresses.length),
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
