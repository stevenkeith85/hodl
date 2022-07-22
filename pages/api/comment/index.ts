import { NextApiRequest, NextApiResponse } from "next";

import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from '../handler';

import { Redis } from '@upstash/redis';

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getComment = memoize(async (id) => {
  const comment = await client.get(`comment:${id}`);
  return comment;
}, { 
  async: true,
  primitive: true,
  max: 10000, 
});


route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const comment = await getComment(id);
  res.status(200).json(comment)
});

export default route;
