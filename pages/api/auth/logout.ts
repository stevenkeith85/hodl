// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import cookie from 'cookie'

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

route.post(async (req, res: NextApiResponse) => {  
  if (!req.address) {
    return res.status(403).json({ message: "Not authenticated" });
  }

  // delete the session 
  await client.hdel(`user:${req.address}`, 'sessionId');

  // clear the cookie
  res.setHeader('Set-Cookie', cookie.serialize('refreshToken', "", { httpOnly: true, path: '/', maxAge: -1}))

  res.status(200).json({message: 'ok'});
});


export default route;
