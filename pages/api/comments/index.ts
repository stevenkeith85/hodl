import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import memoize from 'memoizee';
import axios from 'axios';
const client = Redis.fromEnv()
import apiRoute from "../handler";

dotenv.config({ path: '../.env' })
const route = apiRoute();

// export const getCommentsForToken = async (token) => {
//   const comments = await client.zrange(`comments:${token}`, 0, -1);
//   return comments;
// }

export const getCommentsForToken = async (token: number, offset: number, limit: number) => {
  try {
    const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/comments:${token}/${offset}/${offset + limit - 1}/rev`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    })
    const comments = r.data.result.map(item => JSON.parse(item));
    const total = await client.zcard(`comments:${token}`);
    return { items: comments, next: Number(offset) + Number(comments.length), total: Number(total) };
  } catch (e) {
    return { items: [], next: 0, total: 0 };
  }
};


route.get(async (req, res: NextApiResponse) => {
  const { token, offset, limit } = req.query;

  if (!token || !offset || !limit) {
      return res.status(400).json({ message: 'Bad Request' });
  }

  if (!token) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const comments = await getCommentsForToken(Number(token), Number(offset), Number(limit));
  res.status(200).json(comments);
});


export default route;
