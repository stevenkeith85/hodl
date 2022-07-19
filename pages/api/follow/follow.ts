import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import { getFollowing } from "./following";
import { isFollowing } from "./follows";
import { getFollowers } from "./followers";
import apiRoute from "../handler";
import { isValidAddress } from '../../../lib/profile';
import { getFollowingCount } from './followingCount';
import { getFollowersCount } from './followersCount';
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
    return res.status(400).json({ message: 'Bad Request - No address supplied' });
  }

  if (req.address === address) { // Can't follow yourself
    return res.status(400).json({ message: 'Bad Request - Cannot follow yourself' });
  }

  if (!(await isValidAddress(address))) {
    return res.status(400).json({ message: 'Bad Request - Invalid address' });
  }

  let followed = false;

  const exists = await client.zscore(`following:${req.address}`, address);

  if (exists) { // Unfollow
    // TODO: This should be a transaction
    await client.zrem(`following:${req.address}`, address);
    await client.zrem(`followers:${address}`, req.address);

    if (await client.zscore('rankings:address', address) !== 0) { // just in case things get out of sync (we don't want them to though)
      await client.zincrby('rankings:address', -1, address);
    }
    //
  } else { // Follow
    const timestamp = Date.now();

    await client.zadd(`following:${req.address}`,
      {
        member: address,
        score: timestamp
      });

    await client.zadd(`followers:${address}`,
      {
        member: req.address,
        score: timestamp
      });
    await client.zincrby('rankings:address', 1, address);

    followed = true;
  }

  isFollowing.delete(req.address, address);

  getFollowing.delete(req.address);
  getFollowingCount.delete(req.address);

  getFollowers.delete(address);
  getFollowersCount.delete(address);

  // Do the notification last
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
