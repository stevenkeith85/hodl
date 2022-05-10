// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

const client = Redis.fromEnv()
import apiRoute from "../handler";

dotenv.config({ path: '../.env' })
const route = apiRoute();


route.get(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const notifications = await client.zrange(`notifications:${req.address}`, 0, -1);

  res.status(200).json(notifications);

});


export default route;
