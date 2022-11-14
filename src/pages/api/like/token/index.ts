import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';

import apiRoute from "../../handler";
import { ActionTypes } from "../../../../models/HodlAction";
import { runRedisTransaction } from "../../../../lib/database/rest/databaseUtils";
import { addToZeplo } from "../../../../lib/addToZeplo";

const route = apiRoute();

const client = Redis.fromEnv()

// This could be vulnerable to CSRF. To prevent this we are setting the auth cookies to LAX.
// https://portswigger.net/web-security/csrf/samesite-cookies
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

  console.log("exists", exists)
  if (exists) { // unlike

    console.log("unliking token");
    const cmds = [
      ['ZREM', `liked:tokens:${req.address}`, token],
      ['ZREM', `likes:token:${token}`, req.address]
    ];

    const success = await runRedisTransaction(cmds);

    if (!success) {
      return res.status(510).json({ message: 'Upstream error' });
    }
  } else { // like
    console.log("liking token")
    const timestamp = Date.now();

    const cmds = [
      ['ZADD', `liked:tokens:${req.address}`, timestamp, token],
      ['ZADD', `likes:token:${token}`, timestamp, req.address]
    ];

    const success = await runRedisTransaction(cmds);

    if (!success) {
      return res.status(510).json({ message: 'Upstream error' });
    }

    liked = true;

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

  // We can't just increment / decrement as the rankings set is periodically trimmed; so re-entries will not start at 0
  // TODO: Possibly could be spun off as a queue task
  const tokenLikeCount = await client.zcard(`likes:token:${token}`);
  await client.zadd('rankings:token:likes:count', 
  {
    score: tokenLikeCount,
    member: token
  });

  console.log('liked', liked)
  return res.status(200).json({ liked });
});


export default route;
