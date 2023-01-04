import { Redis } from '@upstash/redis';

import apiRoute from "../handler";

import { ActionTypes } from '../../../models/HodlAction';
import { addToZeplo, addToZeploWithUserAuth } from '../../../lib/addToZeplo';
import { runRedisTransaction } from '../../../lib/database/rest/databaseUtils';
import { validAddressFormat } from '../../../lib/utils';

const client = Redis.fromEnv()
const route = apiRoute();

// Data Structures:
//
// User:
// The user's followers are stored in a ZSET
// "user:0x1234:followers" -> (<address>/<time>, <address>/<time>, <address>/<time>)
//
// and the collection of users the follow is stored like:
// "user:0x1234:following" -> (<address>/<time>, <address>/<time>, <address>/<time>)
//
// Tags:
// We MAY let users follow tags in the future. 
//
// Potentially could have:
// "user:0x1234:following:tags" -> (<tag>/<time>, <tag>/<time>, <tag>/<time>)
export const toggleFollow = async (userAddress, targetAddress, req) => {
  let followed = false;

  const exists = await client.zscore(`user:${userAddress}:following`, targetAddress);

  if (exists) { // Unfollow
    const cmds = [
      ['ZREM', `user:${userAddress}:following`, targetAddress],
      ['ZREM', `user:${targetAddress}:followers`, userAddress]
    ];

    const success = await runRedisTransaction(cmds);

    if (!success) {
      throw new Error('Unable to run transaction');
    }
  } else { // Follow
    const timestamp = Date.now();

    const cmds = [
      ['ZADD', `user:${userAddress}:following`, timestamp, targetAddress],
      ['ZADD', `user:${targetAddress}:followers`, timestamp, userAddress]
    ];

    const success = await runRedisTransaction(cmds);

    if (!success) {
      throw new Error('Unable to run transaction');
    }

    const action = {
      subject: req.address,
      action: ActionTypes.Followed,
      object: "address",
      objectId: targetAddress
    };

    await addToZeplo(
      'api/actions/add',
      action,
    );
  }

  // We can't just increment / decrement as the set is periodically trimmed; so re-entries will not start at 0
  // TODO: Possibly could be spun off as a queue task
  const userFollowerCount = await client.zcard(`user:${targetAddress}:followers`);
  await client.zadd('rankings:user:followers:count', 
  {
    score: userFollowerCount,
    member: targetAddress
  });

  return followed;
}

// This could be vulnerable to CSRF. To prevent this we are setting the auth cookies to LAX.
// https://portswigger.net/web-security/csrf/samesite-cookies
route.post(async (req, res) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  if (req.address === address) { // Can't follow yourself
    return res.status(400).json({ message: 'Bad Request' });
  }

  if (!validAddressFormat(address)) { // not a valid address
    return res.status(400).json({ message: 'Bad Request' });
  }

  const followed = await toggleFollow(req.address, address, req);

  res.status(200).json({ followed });
});


export default route;
