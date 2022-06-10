import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import axios from 'axios';

import apiRoute from "../../handler";
import { GetCommentsValidationSchema } from "../../../../validationSchema/comments/getComments";

dotenv.config({ path: '../.env' })
const route = apiRoute();
const client = Redis.fromEnv()

export const getCommentsForComment = async (id: number, offset: number, limit: number) => {
  try {
    const total = await client.zcard(`comments:comment:${id}`);

    if (offset >= total) {
      return { items: [], next: Number(total), total: Number(total) };
    }

    const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/comments:comment:${id}/${offset}/${offset + limit - 1}/rev`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    })
    const commentIds = r.data.result.map(item => JSON.parse(item));

    const comments = [];
    for (const id of commentIds) {
      comments.push(await client.hget(`comment`, id));
    }


    return { items: comments, next: Number(offset) + Number(comments.length), total: Number(total) };
  } catch (e) {
    return { items: [], next: 0, total: 0 };
  }
}

route.get(async (req, res: NextApiResponse) => {
  const id = Array.isArray(req.query.id) ? req.query.token[0] : req.query.id;
  const offset = Array.isArray(req.query.offset) ? req.query.offset[0] : req.query.offset;
  const limit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;

  const isValid = await GetCommentsValidationSchema.isValid(req.query)
  if (!isValid) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const comments = await getCommentsForComment(Number(id), Number(offset), Number(limit));
  res.status(200).json(comments);
});


export default route;
