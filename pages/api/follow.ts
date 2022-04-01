// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect'
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import { getFollowing } from "./following";
import { isFollowing } from "./follows";
import { getFollowers } from "./followers";
import apiRoute from "./handler";

dotenv.config({ path: '../.env' })
const route = apiRoute();

// const apiRoute = nextConnect({
//   onNoMatch(req: NextApiRequest, res: NextApiResponse) {
//     res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
//   },
// });


// POST /api/follow
//
// {
//   "address": <address>
//   "addressToFollow": <address>
// }
// Requests that address1 follows OR unfollows address2 (toggle behaviour)
route.post(async (req: NextApiRequest, res: NextApiResponse) => {
  
  const { address1, address2 } = req.body;
  let followed = false;

  try {
    const client = new Redis(process.env.REDIS_CONNECTION_STRING);
    const exists = await client.hexists(`following:${address1}`, address2); // O(1)

    if (exists) {
      // address1 is no longer following address 2, and address2's followers no longer contains address 1
      await client.hdel(`following:${address1}`, address2); // O(1)
      await client.hdel(`followers:${address2}`, address1); // O(1)
    } else {
      // address1 is now following address 2, and address2's followers now contains address 1
      await client.hset(`following:${address1}`, address2, 1); // O(1) 'following:0x1234' : { 0x5678: 1 }
      await client.hset(`followers:${address2}`, address1, 1); // O(1) 'followers:0x5678' : { 0x1234: 1 }
      followed = true;
    }

    await client.quit();

    // clear cache
    getFollowing.delete(address1, true);
    isFollowing.delete(address1, address2, true);

    getFollowers.delete(address2, true);
    
    res.status(200).json({followed});
  } catch (error) {
    console.log('ERROR', error);
    res.status(500).json({ error });
  }

});


export default route;
