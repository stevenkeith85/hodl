import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../../handler";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getLikeCount = async (token) => {    
  const count = await client.zcard(`likes:token:${token}`);
  return count || 0;
}

// Requests the number of users who like a token
route.get(async (req, res) => {
  const { id: token } = req.query;

  if (!token) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const count = await getLikeCount(token);
  res.status(200).json(count);
});


export default route;
