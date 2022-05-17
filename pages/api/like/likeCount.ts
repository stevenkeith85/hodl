// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import memoize from 'memoizee';

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

// Memo cleared when someone likes/dislikes the token
export const getLikeCount = memoize(async (token) => {
  // console.log("CALLING REDIS TO GET TOKEN LIKE COUNT", token);
    
  const count = await client.hlen(`likedby:${token}`);
  return count;
}, { 
  primitive: true,
  max: 10000, // 10000 tokens 
});

// Requests the number of users who like a token
route.get(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const count = await getLikeCount(token);
  res.status(200).json({count});
});


export default route;
