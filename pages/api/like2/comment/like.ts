import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

import { likesComment } from "./likes";
import { getCommentLikeCount } from './count';

const client = Redis.fromEnv()
import apiRoute from "../../handler";
import { addAction } from "../../actions/add";
import { HodlAction, ActionTypes } from "../../../../models/HodlAction";

dotenv.config({ path: '../.env' })
const route = apiRoute();

// Requests that address likes or stops liking a comment
route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { id: comment } = req.body;

  if (!comment) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  let liked = false;

  const exists = await client.zscore(`liked:comments:${req.address}`, comment);

  const timestamp = Date.now();

  if (exists) {
    await client.zrem(`liked:comments:${req.address}`, comment);
    await client.zrem(`likes:comment:${comment}`, req.address);
  } else {
    await client.zadd(`liked:comments:${req.address}`,
      {
        member: comment,
        score: timestamp
      });
    await client.zadd(`likes:comment:${comment}`,
      {
        member: req.address,
        score: timestamp
      });
    liked = true;
  }

  likesComment.delete(req.address, comment);
  getCommentLikeCount.delete(comment);

  if (liked) {
    const notification: HodlAction = {
      subject: req.address,
      action: ActionTypes.Liked,
      object: "comment",
      objectId: comment,
    };

    const success = addAction(notification);
  }

  res.status(200).json({ liked });
});


export default route;
