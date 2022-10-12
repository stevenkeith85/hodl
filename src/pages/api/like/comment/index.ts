import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import axios from 'axios';

import apiRoute from "../../handler";
import { addAction } from "../../actions/add";
import { HodlAction, ActionTypes } from "../../../../models/HodlAction";
import { User } from "../../../../models/User";

dotenv.config({ path: '../.env' })
const route = apiRoute();
const client = Redis.fromEnv()

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

  // TODO: Make these atomic, when the pipeline option supports it, in upstash
  // 'liked' should only be set true if the atomic operation succeeds
  if (exists) {
    const p = client.pipeline();

    p.zrem(`liked:comments:${req.address}`, comment);
    p.zrem(`likes:comment:${comment}`, req.address);

    const [membersRemovedFromUserSet, membersRemovedFromCommentSet] = await p.exec<[number, number]>();
  } else {
    const p = client.pipeline();

    p.zadd(`liked:comments:${req.address}`,
      {
        member: comment,
        score: timestamp
      });

    p.zadd(`likes:comment:${comment}`,
      {
        member: req.address,
        score: timestamp
      });
      const [membersAddedToUserSet, membersAddedToCommentSet] = await p.exec<[number, number]>();

    liked = true;
  }

  if (liked) {
    // TODO - We don't await this at the moment; as we do nothing with the return code.
    // it takes up to a second to get a response. possibly something to follow up with serverlessq at some point
    // we should really log whether things were added to the queue for support purposes
    const { accessToken, refreshToken } = req.cookies;
    const user = await client.hmget<User>(`user:${req.address}`, 'actionQueueId');
    const url = `https://api.serverlessq.com?id=${user?.actionQueueId}&target=${process.env.VERCEL_URL || process.env.MESSAGE_HANDLER_HOST}/api/actions/add`;
    try {
      axios.post(
        url,
        {
          action: ActionTypes.Liked,
          object: "comment",
          objectId: comment
        },
        {
          withCredentials: true,
          headers: {
            "Accept": "application/json",
            "x-api-key": process.env.SERVERLESSQ_API_TOKEN,
            "Content-Type": "application/json",
            "Cookie": `refreshToken=${refreshToken}; accessToken=${accessToken}`
          }
        }
      )
    } catch (e) {
      console.log(e)
    }
  }

  res.status(200).json({ liked });
});


export default route;
