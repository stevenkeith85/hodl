// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import memoize from 'memoizee';

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getFollowersCount = memoize(async (address) => {
  console.log("CALLING REDIS TO GET FOLLOWERS COUNT", address);

  const count = await client.hlen(`followers:${address}`);
  return count;
}, { 
  primitive: true,
  max: 10000, // 10000 tokens 
});

route.get(async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const count = await getFollowersCount(address);
  res.status(200).json({count});
});


export default route;
