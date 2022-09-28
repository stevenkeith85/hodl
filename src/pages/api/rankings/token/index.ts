import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../../handler";
import { getToken } from "../../token/[tokenId]";
import { getAsString } from "../../../../lib/utils";
import { Token } from "../../../../models/Token";

dotenv.config({ path: '../.env' })

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
      next: Number(total),
      total: Number(total)
    };
  }

  const ids: string[] = await client.zrange(`rankings:token:likes:count`, offset, offset + limit - 1, { rev: true });
  const promises = ids.map(address => getToken(address));
  const tokens: Token[] = await Promise.all(promises);
  
  
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
