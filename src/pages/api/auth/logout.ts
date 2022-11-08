import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';

import apiRoute from "../handler";
import cookie from 'cookie'
import { pusher } from "../../../lib/server/pusher";


const client = Redis.fromEnv()
const route = apiRoute();

export const clearSession = async (address) => {
  await client.hdel(`user:${address}`, 'sessionId');
}

export const clearCookies = (res) => {
  res.setHeader('Set-Cookie', [
    cookie.serialize('accessToken', "", { httpOnly: true, path: '/', maxAge: -1}),
    cookie.serialize('refreshToken', "", { httpOnly: true, path: '/', maxAge: -1})
  ])
}

export const logout = async (req, res) => {
  await clearSession(req.address);
  pusher.terminateUserConnections(req.address);

  clearCookies(res);
}

// This could be vulnerable to CSRF. To prevent this we are setting the auth cookies to LAX.
// https://portswigger.net/web-security/csrf/samesite-cookies
route.post(async (req, res: NextApiResponse) => {  
  if (!req.address) {
    return res.status(403).json({ message: "Not authenticated" });
  }

  await logout(req, res);

  res.status(200).json({message: 'ok'});
});


export default route;
