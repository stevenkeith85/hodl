// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiResponse } from "next";
import * as Redis from 'ioredis';
import dotenv from 'dotenv'

import { likesToken } from "./likes";
import { getLikeCount } from './likeCount';

import apiRoute from "../handler";

dotenv.config({ path: '../.env' })
const route = apiRoute();

// Requests that address likes or stops liking a token
route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({message: 'Bad Request - No token supplied'});
  }

  let liked = false;

  console.log("CALLING REDIS TO TOGGLE WHETHER ADDRESS LIKES TOKEN", req.address, token);
  const client = new Redis(process.env.REDIS_CONNECTION_STRING);
  const exists = await client.hexists(`likes:${req.address}`, token); // O(1)

  if (exists) {
    await client.hdel(`likes:${req.address}`, token);
    await client.hdel(`likedby:${token}`, req.address);
  } else {
    await client.hset(`likes:${req.address}`, token, 1);
    await client.hset(`likedby:${token}`, req.address, 1);
    liked = true;
  }

  await client.quit();
  
  likesToken.delete(req.address, token);
  getLikeCount.delete(token);
  
  res.status(200).json({liked});
});


export default route;
