import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import { isValidAddress } from '../../../lib/profile';
import { HodlAction, ActionTypes } from '../../../models/HodlAction';
import { addAction } from '../actions/add';
import { trimZSet } from '../../../lib/databaseUtils';

dotenv.config({ path: '../.env' })
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
export const toggleFollow = async (userAddress, targetAddress) => {
  let followed = false;

  const exists = await client.zscore(`user:${userAddress}:following`, targetAddress);

  if (exists) { // Unfollow
    // TODO: REDIS TRANSACITON
    await client.zrem(`user:${userAddress}:following`, targetAddress);
    await client.zrem(`user:${targetAddress}:followers`, userAddress);
    await client.zincrby('rankings:user:followers:count', -1, targetAddress);
    //

  } else { // Follow
    const timestamp = Date.now();

    // TODO: REDIS TRANSACITON
    await client.zadd(`user:${userAddress}:following`, { member: targetAddress, score: timestamp});
    await client.zadd(`user:${targetAddress}:followers`, { member: userAddress, score: timestamp});
    await client.zincrby('rankings:user:followers:count', 1, targetAddress);
    //

    followed = true;
  }

  await trimZSet(client, 'rankings:user:followers:count');

  if (followed) {
    const notification: HodlAction = {
      subject: userAddress,
      action: ActionTypes.Followed,
      object: "address",
      objectId: targetAddress
    };

    const success = await addAction(notification);
  }

  return followed;

}

// <req.address> to follow/unfollow <address>
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

  if (!(await isValidAddress(address))) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const followed = await toggleFollow(req.address, address);

  res.status(200).json({ followed });
});


export default route;
