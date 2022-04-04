// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from "./handler";

dotenv.config({ path: '../.env' })

const route = apiRoute();

// Find out if adress likes token
// Memo cleared when 'like' is toggled
export const likesToken = memoize(async (address, token) => {
  console.log("CALLING REDIS TO SEE IF ADDRESS LIKES TOKEN", address, token);
  const client = new Redis(process.env.REDIS_CONNECTION_STRING);
  const likes = await client.hexists(`likes:${address}`, token);
  await client.quit();
  return likes;
}, { 
  primitive: true,
  max: 1000, // 1000 tokens 
});


route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, token } = req.query;

  if (!address || !token) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const likes = await likesToken(address, token);
  res.status(200).json({likes});
  
});


export default route;
