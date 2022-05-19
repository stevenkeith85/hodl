import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

const client = Redis.fromEnv()
import apiRoute from "../handler";

dotenv.config({ path: '../.env' })
const route = apiRoute();

export const getCommentsForToken = async (token) => {
  const comments = await client.zrange(`comments:${token}`, 0, -1);
  return comments;
}

route.get(async (req, res: NextApiResponse) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const comments = await getCommentsForToken(token);

  res.status(200).json(comments.reverse());

});


export default route;
