// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

import { likesToken } from "./likes";
import { getLikeCount } from './likeCount';

const client = Redis.fromEnv()
import apiRoute from "../handler";
import { addNotification } from "../notifications/add";
import { HodlNotification, NotificationTypes } from "../../../models/HodlNotifications";

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

  // console.log("CALLING REDIS TO TOGGLE WHETHER ADDRESS LIKES TOKEN", req.address, token);
  const exists = await client.hexists(`likes:${req.address}`, token); // O(1)

  if (exists) {
    await client.hdel(`likes:${req.address}`, token);
    await client.hdel(`likedby:${token}`, req.address);
  } else {
    await client.hset(`likes:${req.address}`, {[token]: 1});
    await client.hset(`likedby:${token}`, {[req.address]: 1});
    liked = true;
  }
  
  likesToken.delete(req.address, token);
  getLikeCount.delete(token);

  if (liked) {
    const notification: HodlNotification = {
      subject: req.address,
      action: NotificationTypes.Liked,
      tokenId: token
    };
  
    const success = addNotification(notification);
  }
  
  res.status(200).json({liked});
});


export default route;
