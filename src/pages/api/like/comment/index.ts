import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';

import apiRoute from "../../handler";
import { ActionTypes } from "../../../../models/HodlAction";
import { runRedisTransaction } from "../../../../lib/database/rest/databaseUtils";
import { addToZeplo, addToZeploWithUserAuth } from "../../../../lib/addToZeplo";


const route = apiRoute();
const client = Redis.fromEnv()

// This could be vulnerable to CSRF. To prevent this we are setting the auth cookies to LAX.
// https://portswigger.net/web-security/csrf/samesite-cookies
route.post(async (req, res: NextApiResponse) => {
  // const start = Date.now();

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
    const action = {
      subject: req.address,
      action: ActionTypes.Liked,
      object: "comment",
      objectId: comment,
    };

    await addToZeplo(
      'api/actions/add',
      action,
    );
  }

  // const stop = Date.now()
  // console.log('like/comment time taken', stop - start);

  return res.status(200).json({ liked });
});


export default route;
