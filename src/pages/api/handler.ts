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
      return res.status(429).json({ message: `Slow down a little - ${routeKey}` })
    }
  } 
  
  next();
}

// Comment out for development to save db calls
// TODO: Go through every route and make sure we haven't missed any
const rateLimits = {
  // 'POST:/api/create/upload': 3,
  // 'POST:/api/create/ipfs': 1,
  // 'POST:/api/like/like': 2,
  // 'POST:/api/follow/follow': 10,

  'GET:/api/tags': 30,
  'POST:/api/tags/add': 6,
  'DELETE:/api/tags/delete': 6,
  
  // 'GET:/api/comments': 90,
  // 'GET:/api/comments/count': 90,
  // 'POST:/api/comments/add': 6,
  // 'DELETE:/api/comments/delete': 6,
  
  // 'GET:/api/search/tokens': 60,
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
