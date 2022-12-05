import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';

import nc from 'next-connect';
import requestIp from 'request-ip';

import { apiAuthenticate } from "../../lib/jwt";

export interface HodlApiRequest extends NextApiRequest {
  address: string | null
}

const client = Redis.fromEnv();


const ratelimit = async (req, res, next) => {
  const ip = requestIp.getClientIp(req);
  const method = req.method;
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

  const routeKey = `${method}:${pathname}`;
  const limit = rateLimits[routeKey];

  if (limit) {
    const limited = await isRateLimited(ip, routeKey, limit);

    if (limited) {
      return res.status(429).json({ message: `Slow down a little` })
    }
  }

  next();
}

const rateLimits = {
  // We can be rate limited on these routes; so need to be fairly strict
  'POST:/api/create/ipfsImageAndAsset': 6,
  'POST:/api/create/ipfsMetadata': 6,

  // These are the state changing routes in the app that a bot might try to manipulate
  // limit the user to one state changing action every 3 seconds
  'POST:/api/like/token': 15,
  'POST:/api/like/comment': 15,
  'POST:/api/follow': 15,
  'POST:/api/comments/add': 15,

  'POST:/api/profile/nickname': 10,
  'DELETE:/api/comments/delete': 15,
}


const isRateLimited = async (ip, routeKey, limit) => {
  const secondsBeforeExpires = 30;

  const key = `ping:${ip}:${routeKey}`;

  const set = await client.setnx(key, limit)
  if (set) {
    await client.expire(key, secondsBeforeExpires)
  }

  const requestsLeft = await client.get(key);
  if (requestsLeft && Number(requestsLeft) > 0) {
    await client.decrby(key, 1)
    return false;
  }

  return true;
}

const handler = () => nc<HodlApiRequest, NextApiResponse>({
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
  onError(error, req, res) {
    console.log('API Route Error', 'address: ', req.address, 'path: ', req.url, 'error: ', error)
    res.status(500).json(error);
  }
})
  .use(ratelimit)
  .use(apiAuthenticate)


export default handler;
