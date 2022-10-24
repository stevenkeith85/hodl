import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';

import apiRoute from "../../handler";

import { Token } from "../../../../models/Token";
import { getTokens } from "../../../../lib/database/Tokens";
import { getAsString } from "../../../../lib/getAsString";


const client = Redis.fromEnv()
const route = apiRoute();

// data structures:
//

// ZSET (rankings:token:likes:count) <id> and like count of a token
export const getMostLikedTokens = async (
  offset: number = 0,
  limit: number = 10
): Promise<
  {
    items: Token[],
    next: number,
    total: number
  }> => {

  const total = await client.zcard(`rankings:token:likes:count`);

  if (offset >= total) {
    return {
      items: [],
      next: Number(offset) + Number(limit),
      total: Number(total)
    };
  }

  const ids: string[] = await client.zrange(`rankings:token:likes:count`, offset, offset + limit - 1, { rev: true });

  const tokens = await getTokens(ids);
  
  return {
    items: tokens,
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

  const tokens = await getMostLikedTokens(+offset, +limit);

  res.status(200).json(tokens);

});


export default route;
