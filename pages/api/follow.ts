// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import { getFollowing } from "./following";
import { isFollowing } from "./follows";
import { getFollowers } from "./followers";
import apiRoute from "./handler";
import { isValidAddress } from '../../lib/profile';

dotenv.config({ path: '../.env' })
const route = apiRoute();


// Requests that user follows OR unfollows address (toggle behaviour)
route.post(async (req, res) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { address } = req.body;

  if (!address) {
    return res.status(400).json({message: 'Bad Request - No address supplied'});
  }

  if (req.address === address) { // Can't follow yourself
    return res.status(400).json({message: 'Bad Request - Cannot follow yourself'});
  }
  
  if (!(await isValidAddress(address))) {
    return res.status(400).json({message: 'Bad Request - Invalid address'});
  }

  let followed = false;

  const client = new Redis(process.env.REDIS_CONNECTION_STRING);
  const exists = await client.hexists(`following:${req.address}`, address);

  if (exists) {
    await client.hdel(`following:${req.address}`, address);
    await client.hdel(`followers:${address}`, req.address);
  } else {
    await client.hset(`following:${req.address}`, address, 1);
    await client.hset(`followers:${address}`, req.address, 1);
    followed = true;
  }

  await client.quit();

  getFollowing.delete(req.address);
  isFollowing.delete(req.address, address);
  getFollowers.delete(address);
  
  res.status(200).json({followed});
});


export default route;
