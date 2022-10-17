import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../../handler";
import { ActionTypes } from "../../../../models/HodlAction";
import { runRedisTransaction } from "../../../../lib/databaseUtils";
import { addActionToQueue } from "../../../../lib/actions/addToQueue";

dotenv.config({ path: '../.env' })
const route = apiRoute();
const client = Redis.fromEnv()

// Requests that address likes or stops liking a comment
route.post(async (req, res: NextApiResponse) => {
  const start = Date.now();
  
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
    const cmds = [
      ['ZREM', `liked:comments:${req.address}`, comment],
      ['ZREM', `likes:comment:${comment}`, req.address],
    ];

    await runRedisTransaction(cmds);
  } else {
    const cmds = [
      ['ZADD', `liked:comments:${req.address}`, timestamp, comment],
      ['ZADD', `likes:comment:${comment}`, timestamp, req.address],
    ];

    liked = await runRedisTransaction(cmds);
  }

  if (liked) {
    await addActionToQueue(
      req.cookies.accessToken,
      req.cookies.refreshToken,
      {
          subject: req.address,
          action: ActionTypes.Liked,
          object: "comment",
          objectId: comment,
      });
  }

  const stop = Date.now()
  console.log('like/comment time taken', stop - start);

  return res.status(200).json({ liked });
});


export default route;
