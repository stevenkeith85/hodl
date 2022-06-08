import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../../handler";
import memoize from 'memoizee';

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getCommentLikeCount = memoize(async (comment) => {    
  const count = await client.zcard(`likes:comment:${comment}`);
  return count;
}, { 
  primitive: true,
  max: 10000, // 10000 tokens 
});

// Requests the number of users who like a comment
route.get(async (req, res) => {
  const { id: comment } = req.query;

  if (!comment) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const count = await getCommentLikeCount(comment);
  res.status(200).json({count});
});


export default route;
