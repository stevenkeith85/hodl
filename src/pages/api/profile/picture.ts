import { NextApiResponse } from "next"
import { Redis } from '@upstash/redis';

import apiRoute from "../handler";
import { getMutableToken } from "../contracts/mutable-token/[tokenId]";


const client = Redis.fromEnv();
const route = apiRoute();

// This could be vulnerable to CSRF. To prevent this we are setting the auth cookies to LAX.
// https://portswigger.net/web-security/csrf/samesite-cookies
route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'bad request' });
  }

  const mutableToken = await getMutableToken(token, req);
  if (mutableToken?.hodler !== req.address) {
    return res.status(400).json({ error: 'bad request' });
  }

  await client.hset(`user:${req.address}`, { 'avatar': token });

  return res.status(200).json({ message: 'ok' });
});

export default route;
