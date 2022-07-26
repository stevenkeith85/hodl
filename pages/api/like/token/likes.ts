import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from "../../handler";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

// Find out if address likes token
// export const likesToken = memoize(async (address, token) => {
//   const likes = await client.zscore(`liked:tokens:${address}`, token);
//   return Boolean(likes);
// }, { 
//   primitive: true,
//   max: 1000, // 1000 tokens 
// });

export const likesToken = async (address, token) => {
  const likes = await client.zscore(`liked:tokens:${address}`, token);
  return Boolean(likes);
}

route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, id: token } = req.query;

  if (!address || !token) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const likes = await likesToken(address, token);
  res.status(200).json({likes});
  
});


export default route;
