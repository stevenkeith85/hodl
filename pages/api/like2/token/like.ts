// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

import { likesToken } from "./likes";
import { getLikeCount } from './count';

const client = Redis.fromEnv()
import apiRoute from "../../handler";
import { addNotification } from "../../notifications/add";
import { HodlNotification, NotificationTypes } from "../../../../models/HodlNotifications";

dotenv.config({ path: '../.env' })
const route = apiRoute();

// Requests that address likes or stops liking a token
route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { id: token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  let liked = false;

  const exists = await client.zscore(`liked:tokens:${req.address}`, token);
  console.log('exists', exists)

  if (exists) {
    await client.zrem(`liked:tokens:${req.address}`, token);
    await client.zrem(`likes:token:${token}`, req.address);
  } else {
    const timestamp = Date.now();

    await client.zadd(`liked:tokens:${req.address}`,
      {
        member: token,
        score: timestamp
      });
    await client.zadd(`likes:token:${token}`,
      {
        member: req.address,
        score: timestamp
      });
    liked = true;
  }

  likesToken.delete(req.address, token);
  getLikeCount.delete(token);

  if (liked) {
    const notification: HodlNotification = {
      subject: req.address,
      action: NotificationTypes.Liked,
      object: "token",
      id: token
    };

    const success = addNotification(notification);
  }

  res.status(200).json({ liked });
});


export default route;
