import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getFollowersCount = async (address) => {
  if (!address) {
    return 0;
  }
  const count = await client.zcard(`user:${address}:followers`);
  return (count || 0);
}


route.get(async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const count = await getFollowersCount(address);
  res.status(200).json(count);
});


export default route;
