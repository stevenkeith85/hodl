import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';

import apiRoute from "../../handler";
import { ActionTypes } from "../../../../models/HodlAction";
import { runRedisTransaction } from "../../../../lib/databaseUtils";
import { addToZeplo } from "../../../../lib/addToZeplo";

const route = apiRoute();

const client = Redis.fromEnv()

// Requests that address likes or stops liking a token
route.post(async (req, res: NextApiResponse) => {
  const start = Date.now();

  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { id: token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  let liked = false;

  const exists = await client.zscore(`liked:tokens:${req.address}`, token);

  if (exists) { // unlike
    const cmds = [
      ['ZREM', `liked:tokens:${req.address}`, token],
      ['ZREM', `likes:token:${token}`, req.address],
      ['ZINCRBY', 'rankings:token:likes:count', -1, token],
      ["ZREMRANGEBYRANK", 'rankings:token:likes:count', 0, -(500 + 1)],
    ];

    await runRedisTransaction(cmds);
  } else { // like
    const timestamp = Date.now();

    const cmds = [
      ['ZADD', `liked:tokens:${req.address}`, timestamp, token],
      ['ZADD', `likes:token:${token}`, timestamp, req.address],
      ['ZINCRBY', 'rankings:token:likes:count', 1, token],
      ["ZREMRANGEBYRANK", 'rankings:token:likes:count', 0, -(500 + 1)],
    ];

    liked = await runRedisTransaction(cmds);
  }

  if (liked) {
    // TODO: If the action isn't added to the queue, we should
    // probably log it somewhere (redis?) and try again later
    //
    // possibly a cron script that runs once every x mins 
    // to check for things that were missed

    const action = {
      subject: req.address,
      action: ActionTypes.Liked,
      object: "token",
      objectId: token
    };

    await addToZeplo(
      'api/actions/add',
      action,
      req.cookies.refreshToken,
      req.cookies.accessToken,
      req.address
    );
  }

  const stop = Date.now()
  console.log('like/token time taken', stop - start);

  res.status(200).json({ liked });
});


export default route;
