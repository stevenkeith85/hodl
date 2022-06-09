import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../../handler";
import memoize from 'memoizee';

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getReplyCount = memoize(async (id) => {
  const count = await client.zcard(`comments:comment:${id}`);
  return count;
}, { 
  primitive: true,
  max: 10000, // 10000 tokens 
});


route.get(async (req, res) => {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  if (!id) {
    return res.status(400).json({message: 'Bad Request'});
  }

  if (!parseInt(id as string)) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const count = await getReplyCount(id);
  res.status(200).json(count);
});


export default route;
