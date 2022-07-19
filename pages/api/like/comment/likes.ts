import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from "../../handler";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

// Find out if address likes comment
export const likesComment = memoize(async (address, comment) => {
  const likes = await client.zscore(`liked:comments:${address}`, comment);
  return Boolean(likes);
}, { 
  primitive: true,
  max: 1000, // 1000 tokens 
});


route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, id: comment } = req.query;

  if (!address || !comment) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const likes = await likesComment(address, comment);
  res.status(200).json({likes});
  
});


export default route;
