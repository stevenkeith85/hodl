import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import axios from 'axios'
import apiRoute from "../../handler";
import { ActionSet, HodlAction } from "../../../../models/HodlAction";
import { User } from "../../../../models/User";
import { getUser } from "../../user/[handle]";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();


// data structures:
//
// ZSET (rankings:address:followers) <address> and follower count

// The general rankings namespace could look something like (just ideas):
//
// ZSET (rankings:user:followers) <address> and their follower count
// ZSET (rankings:user:likes) <address> and their token like count
// ZSET (rankings:user:score) <address> and a score that factors in their follower count and token like count (perhaps with some recency bias)

// ZSET (rankings:token:likes) <id> and like count of a token
// ZSET (rankings:token:comments) <id> and comment count of a token
export const getMostFollowedUsers = async (
  offset: number = 0,
  limit: number = 10
): Promise<
  {
    items: User[],
    next: number,
    total: number
  }> => {

  const users : User[] = [];
  const total = await client.zcard(`rankings:user:followers`);

  if (offset >= total) {
    return {
      items: users,
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

  if (addresses.length) {
    for (const address of addresses) {
      const data = await getUser(address);//await client.hmget<User>(`user:${address}`, 'address', 'nickname', 'avatar');

      if (data) {
        users.push(data);
      }
    }
  }
  
  return {
    items: users,
    next: Number(offset) + Number(addresses.length),
    total: Number(total)
  };
}


route.get(async (req, res: NextApiResponse) => {
  const offset = Array.isArray(req.query.offset) ? req.query.offset[0] : req.query.offset;
  const limit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;

  if (!offset || !limit) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const addresses = await getMostFollowedUsers(+offset, +limit);

  res.status(200).json(addresses);

});


export default route;
