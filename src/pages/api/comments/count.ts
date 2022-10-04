import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import { CommentCountValidationSchema } from '../../../validation/comments/commentCount';

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getCommentCount = async (object, id) => {
  if (object === "comment") {
    const count = await client.zcard(`comment:${id}:comments`);
    return count;
  } else {
    const count = await client.get(`token:${id}:comments:count`);
    return count || 0;
  }
};

route.get(async (req, res) => {
  try {
    const object = Array.isArray(req.query.object) ? req.query.object[0] : req.query.object;
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

    const isValid = await CommentCountValidationSchema.isValid(req.query)
    if (!isValid) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const count = await getCommentCount(object, id);
    res.status(200).json(count);
  } catch (e) {
    // We likely had a problem talking to the blockchain. 
    // We'll just send back a 200 to the UI though, with a 0 comment count 
    // as there's nothing that can be done.
    //
    console.log(e); 
    return res.status(200).json(0)
  }
});


export default route;
