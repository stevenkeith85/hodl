import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../../handler";
import { getAsString } from "../../../../lib/utils";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();


// data structures:
//
// ZSET (rankings:tag:count) <id> and number of times a tag has been used


export const getMostUsedTags = async (
  offset: number = 0,
  limit: number = 10
): Promise<
  {
    items: string[],
    next: number,
    total: number
  }> => {

  const total = await client.zcard(`rankings:tag:count`);

  if (offset >= total) {
    return {
      items: [],
      next: Number(total),
      total: Number(total)
    };
  }

  const tags: string[] = await client.zrange(`rankings:tag:count`, offset, offset + limit - 1, { rev: true });

  return {
    items: tags,
    next: Number(offset) + Number(tags.length),
    total: Number(total)
  };
}


route.get(async (req, res: NextApiResponse) => {
  const offset = getAsString(req.query.offset);
  const limit = getAsString(req.query.limit);

  if (!offset || !limit) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const tokens = await getMostUsedTags(+offset, +limit);

  res.status(200).json(tokens);

});


export default route;
