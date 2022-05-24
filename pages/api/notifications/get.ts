// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import axios from 'axios'

// const client = Redis.fromEnv()
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

  const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/notifications:${req.address}/+inf/${getTimeStampAgo(7)}/rev/byscore`, {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
    }
  })

  const notifications = r.data.result.map(item => JSON.parse(item));

  res.status(200).json(notifications);

});


export default route;
