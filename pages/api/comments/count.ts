// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import memoize from 'memoizee';

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getCommentCount = memoize(async (token) => {
  const count = await client.zcount(`comments:${token}`, '-inf', '+inf');
  return count;
}, { 
  primitive: true,
  max: 10000, // 10000 tokens 
});


route.get(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const count = await getCommentCount(token);
  res.status(200).json({count});
});


export default route;
