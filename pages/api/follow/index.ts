import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import { isValidAddress } from '../../../lib/profile';
import { HodlAction, ActionTypes } from '../../../models/HodlAction';
import { addAction } from '../actions/add';

dotenv.config({ path: '../.env' })
const client = Redis.fromEnv()
const route = apiRoute();


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

  let followed = false;

  const exists = await client.zscore(`user:${req.address}:following`, address);

  if (exists) { // Unfollow
    // TODO: REDIS TRANSACITON
    await client.zrem(`user:${req.address}:following`, address);
    await client.zrem(`user:${address}:followers`, req.address);
    await client.zincrby('rankings:user:followers', -1, address);
    //

  } else { // Follow
    const timestamp = Date.now();

    // TODO: REDIS TRANSACITON
    await client.zadd(`user:${req.address}:following`, { member: address, score: timestamp});
    await client.zadd(`user:${address}:followers`, { member: req.address, score: timestamp});
    await client.zincrby('rankings:user:followers', 1, address);
    //

    followed = true;
  }

  // isFollowing.delete(req.address, address);

  // getFollowing.delete(req.address);
  // getFollowingCount.delete(req.address);

  // getFollowers.delete(address);
  // getFollowersCount.delete(address);

  if (followed) {
    const notification: HodlAction = {
      subject: req.address,
      action: ActionTypes.Followed,
      object: "address",
      objectId: address
    };

    const success = await addAction(notification);
  }

  res.status(200).json({ followed });
});


export default route;
