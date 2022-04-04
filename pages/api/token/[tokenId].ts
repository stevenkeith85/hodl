// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from '../handler';

dotenv.config({ path: '../.env' })

const route = apiRoute();

export const getToken = memoize(async (tokenId) => {
  console.log('CALLING REDIS TO GET TOKEN INFORMATION FOR', tokenId);
  const client = new Redis(process.env.REDIS_CONNECTION_STRING);
  const token = await client.get('token:' + tokenId);
  await client.quit();
  return JSON.parse(token);
}, { 
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
