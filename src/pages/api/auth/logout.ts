import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import cookie from 'cookie'
import { pusher } from "../../../lib/server/pusher";


dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();


// const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID,
//   key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
//   secret: process.env.PUSHER_APP_SECRET,
//   cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
//   useTLS: true,
//   encryptionMasterKeyBase64: process.env.PUSHER_ENCRYPTION_KEY,
// });

export const clearSession = async (address) => {
  await client.hdel(`user:${address}`, 'sessionId');
}

export const clearCookies = (res) => {
  res.setHeader('Set-Cookie', [
    cookie.serialize('accessToken', "", { httpOnly: true, path: '/', maxAge: -1}),
    cookie.serialize('refreshToken', "", { httpOnly: true, path: '/', maxAge: -1})
  ])
}

route.post(async (req, res: NextApiResponse) => {  
  if (!req.address) {
    return res.status(403).json({ message: "Not authenticated" });
  }

  await clearSession(req.address);
  clearCookies(res);
  pusher.terminateUserConnections(req.address);

  res.status(200).json({message: 'ok'});
});


export default route;
