// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import memoize from 'memoizee';

dotenv.config({ path: '../.env' })

const route = apiRoute();

// Memo cleared when user follows/unfollows an account
export const getFollowersCount = memoize(async (address) => {
  console.log("CALLING REDIS TO GET FOLLOWERS COUNT", address);

  const client = new Redis(process.env.REDIS_CONNECTION_STRING);

  const count = await client.hlen(`followers:${address}`);
  await client.quit();

  return count;
}, { 
  primitive: true,
  max: 10000, // 10000 tokens 
});

// Requests the number of accounts address follows
route.get(async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const count = await getFollowersCount(address);
  res.status(200).json({count});
});


export default route;
