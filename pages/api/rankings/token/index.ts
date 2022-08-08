import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import axios from 'axios'
import apiRoute from "../../handler";
import { ActionSet, HodlAction } from "../../../../models/HodlAction";
import { getToken } from "../../token/[tokenId]";
import { getAsString } from "../../../../lib/utils";

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
export const getMostLikedTokens = async (
  offset: number = 0,
  limit: number = 10
): Promise<
  {
    items: string[],
    next: number,
    total: number
  }> => {

  const total = await client.zcard(`rankings:token:likes`);

  if (offset >= total) {
    return {
      items: [],
      next: Number(total),
      total: Number(total)
    };
  }

  const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/rankings:token:likes/${offset}/${offset + limit - 1}/rev`, {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
    }
  })

  const ids: string [] = r.data.result;

  const tokens = [];

  for (const id of ids) {
    const data = await getToken(id);

    if (data) {
      tokens.push(data);
    }
  }
  
  
  return {
    items: tokens,
    next: Number(offset) + Number(ids.length),
    total: Number(total)
  };
}


route.get(async (req, res: NextApiResponse) => {
  const offset = getAsString(req.query.offset);
  const limit = getAsString(req.query.limit);

  if (!offset || !limit) {
      return res.status(400).json({ message: 'Bad Request' });
  }

  const tokens = await getMostLikedTokens(+offset, +limit);

  res.status(200).json(tokens);

});


export default route;
