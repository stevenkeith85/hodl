import { NextApiRequest, NextApiResponse } from "next";

import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from '../handler';

import { Redis } from '@upstash/redis';

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getToken = memoize(async (tokenId) => {
  console.log('CALLING REDIS TO GET TOKEN INFORMATION FOR', tokenId);
  const token = await client.get('token:' + tokenId);
  return token;
}, { 
  async: true,
  primitive: true,
  max: 10000, 
});


route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { tokenId } = req.query;

  if (!tokenId) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const token = await getToken(tokenId);
  res.status(200).json({ token })
});

export default route;
