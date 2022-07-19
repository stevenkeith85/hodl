import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import axios from 'axios'
import apiRoute from "../handler";
import { ActionSet, HodlAction } from "../../../models/HodlAction";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();


// data structures:
//
// ZSET (rankings:address:followers) <address> and follower count

// Tee general rankings namespace could look something like (just ideas):
//
// ZSET (rankings:address:followers) <address> and their follower count
// ZSET (rankings:address:likes) <address> and their token like count
// ZSET (rankings:address:score) <address> and a score that factors in their follower count and token like count (perhaps with some recency bias)

// ZSET (rankings:token:likes) <address> and like count of a token

// We'll start off simple.
// Return the addresses with the highest follower count
//
// We'll increment/decrement the score (follower count) when a user follows/unfollows (see that endpoint)
export const getMostFollowedUsers = async (
  offset: number = 0,
  limit: number = 10
): Promise<
  {
    items: string[],
    next: number,
    total: number
  }> => {

  const total = await client.zcard(`rankings:address`);

  if (offset >= total) {
    return {
      items: [],
      next: Number(total),
      total: Number(total)
    };
  }

  const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/rankings:address/${offset}/${offset + limit - 1}/rev/withscores`, {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
    }
  })

  console.log('r.data.result', r.data.result)
  const addresses: any [] = [];

  for (let i = 0; i < r.data.result.length; i += 2) {
    addresses.push({
      address: r.data.result[i],
      followers: r.data.result[i+1],
    })
  }
  
  return {
    items: addresses,
    next: Number(offset) + Number(addresses.length),
    total: Number(total)
  };
}


route.get(async (req, res: NextApiResponse) => {
  // if (!req.address) {
  //   return res.status(403).json({ message: "Not Authenticated" });
  // }

  const offset = Array.isArray(req.query.offset) ? req.query.offset[0] : req.query.offset;
  const limit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;

  if (!offset || !limit) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const notifications = await getMostFollowedUsers(+offset, +limit);

  res.status(200).json(notifications);

});


export default route;
