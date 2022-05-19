import { NextApiRequest, NextApiResponse } from "next";

import dotenv from 'dotenv'
import apiRoute from '../handler';

import { Redis } from '@upstash/redis';

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getTagsForToken = async token => {
  const tags = await client.zrange(`tags:${token}`, 0, -1);

  return tags
};

route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const tags = await getTagsForToken(token);
  res.status(200).json(tags)
});

export default route;
