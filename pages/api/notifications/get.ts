// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

const client = Redis.fromEnv()
import apiRoute from "../handler";

dotenv.config({ path: '../.env' })
const route = apiRoute();

const getTimeStampAgo = (days: number): number => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return +d;
}

route.get(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const notifications = await client.zrange(`notifications:${req.address}`, getTimeStampAgo(7), getTimeStampAgo(0), {
    byScore: true
  });

  res.status(200).json(notifications.reverse());

});


export default route;
