import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import { isValidAddress } from '../../../lib/profile';
import { HodlAction, ActionTypes } from '../../../models/HodlAction';
import { addAction } from '../actions/add';
import { trimZSet } from '../../../lib/databaseUtils';
import { User } from '../../../models/User';
import axios from 'axios';

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
export const toggleFollow = async (userAddress, targetAddress, req) => {
  let followed = false;

  const exists = await client.zscore(`user:${userAddress}:following`, targetAddress);

  if (exists) { // Unfollow
    const p = client.pipeline()

    p.zrem(`user:${userAddress}:following`, targetAddress);
    p.zrem(`user:${targetAddress}:followers`, userAddress);
    p.zincrby('rankings:user:followers:count', -1, targetAddress);

    // trim the top users collection.
    // TODO: We might just do this periodically with a cron job
    p.zremrangebyrank(
      'rankings:user:followers:count',
      0, 
      -(500 + 1)
    );

    const [
      membersRemovedFromUserFollowingSet, 
      membersRemovedFromTargetsFollowersSet, 
      updatedRankingCount,
      numberOfElementsRemovedFromTopUsers
    ] = await p.exec<[number, number, number, number]>();
    //

  } else { // Follow
    const p = client.pipeline();

    const timestamp = Date.now();

    p.zadd(`user:${userAddress}:following`, { member: targetAddress, score: timestamp});
    p.zadd(`user:${targetAddress}:followers`, { member: userAddress, score: timestamp});
    p.zincrby('rankings:user:followers:count', 1, targetAddress);

    // trim the top users collection.
    // TODO: We might just do this periodically with a cron job
    p.zremrangebyrank(
      'rankings:user:followers:count',
      0, 
      -(500 + 1)
    );
    
    const [
      membersAddedToUserFollowingSet, 
      membersAddedToTargetsFollowersSet, 
      updatedRankingCount,
      numberOfElementsRemovedFromTopUsers] = await p.exec<[number, number, number, number]>();

    followed = true;
  }

  
  if (followed) {
    // TODO - We don't await this at the moment; as we do nothing with the return code.
    // it takes up to a second to get a response. possibly something to follow up with serverlessq at some point
    // we should really log whether things were added to the queue for support purposes
    const { accessToken, refreshToken } = req.cookies;
    const user = await client.hmget<User>(`user:${req.address}`, 'actionQueueId');
    const url = `https://api.serverlessq.com?id=${user?.actionQueueId}&target=${process.env.MESSAGE_HANDLER_HOST}/api/actions/add`;
    try {
      axios.post(
        url,
        {
          action: ActionTypes.Followed,
          object: "address",
          objectId: targetAddress
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

  if (!isValidAddress(address)) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const followed = await toggleFollow(req.address, address, req);

  res.status(200).json({ followed });
});


export default route;
