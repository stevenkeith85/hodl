// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect'
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import { getFollowing } from "./following";
import { isFollowing } from "./follows";
import { getFollowers } from "./followers";
import { likesToken } from "./likes";

dotenv.config({ path: '../.env' })

const apiRoute = nextConnect({
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});


// POST /api/follow
//
// {
//   "address": <address>
//   "token": <tokenId>
// }
// Requests that address likes token (or stops liking it)
apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
  
  const { address, token } = req.body;

  if (!address || !token) {
    return res.status(200).json({ liked: false });
  }
  let liked = false;

  try {
    console.log("CALLING REDIS TO TOGGLE WHETHER ADDRESS LIKES TOKEN", address, token);
    const client = new Redis(process.env.REDIS_CONNECTION_STRING);
    const exists = await client.hexists(`likes:${address}`, token); // O(1)

    if (exists) {
      // address no longer likes token, and token is no longer liked by address
      await client.hdel(`likes:${address}`, token); // O(1)
      await client.hdel(`likedby:${token}`, address); // O(1)
    } else {
      // address likes token, and token is liked by address
      await client.hset(`likes:${address}`, token, 1); // O(1) 'likes:0x1234' : { 42: 1}
      await client.hset(`likedby:${token}`, address, 1); // O(1) 'likedby:42' : { 0x1234: 1 }
      liked = true;
    }

    await client.quit();

    // clear cache (TODO)
    
    likesToken.delete(address, token);
    

    
    res.status(200).json({liked});
  } catch (error) {
    res.status(500).json({ error });
  }

});


export default apiRoute;
