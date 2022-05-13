// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import next, { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import nc from 'next-connect'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import requestIp from 'request-ip'

dotenv.config({ path: '../.env' })

export interface HodlApiRequest extends NextApiRequest {
  address: string | null
}

const client = Redis.fromEnv();

// Comment out for development to save db calls
const rateLimits = {
  // 'POST:/api/mint/upload': 3,
  // 'POST:/api/mint/ipfs': 1,
  // 'POST:/api/like/like': 2,
  // 'POST:/api/follow/follow': 10
}


const isRateLimited = async (ip, routeKey, limit) => {
  const secondsBeforeExpires = 30;

  const key = `ping:${ip}:${routeKey}`;

  const set = await client.setnx(key, limit)
  if (set) {
    client.expire(key, secondsBeforeExpires)
  }

  const requestsLeft = await client.get(key);
  if (requestsLeft && Number(requestsLeft) > 0) {
    client.decrby(key, 1)
    return false;
  }

  return true;
}

const handler = () => nc<HodlApiRequest, NextApiResponse>({
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
  onError(error, req, res) {
    // TODO: Write this error somewhere. Perhaps REDIS
    console.log('API Route Error', 'address: ', req.address, 'path: ', req.url, 'error: ', error)
    res.status(500).json(error);
  }
})
  .use(async (req, res, next) => {
    const ip = requestIp.getClientIp(req);
    const method = req.method;
    const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

    const routeKey = `${method}:${pathname}`;
    const limit = rateLimits[routeKey];

    if (limit) {
      console.log('This is a rate limited route')
      const limited = await isRateLimited(ip, routeKey, limit);

      if (limited) {
        return res.status(429).json({ message: 'Slow down a little' })
      }
    }
    next();
  })
  .use(async (req, res, next) => {
    const { authorization } = req.headers;
    const { refreshToken } = req.cookies;

    if (!authorization) {
      return next();
    }

    try {
      const { address } = jwt.verify(authorization, process.env.JWT_SECRET);
      req.address = address;
      return next();
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        try {
          const { sessionId } = jwt.verify(refreshToken, process.env.JWT_SECRET);
          const { address } = jwt.decode(authorization);

          const storedSessionId = await client.hget(`user:${address}`, 'sessionId');

          if (sessionId == storedSessionId) { // create a new access token
            const accessToken = jwt.sign(
              { address, sessionId }, process.env.JWT_SECRET, { expiresIn: 60 * 10 }
            ); 
            return res.status(401).json({ refreshed: true, accessToken }); // refresh token is still valid. give the user a new access token to store and let them retry
          }

          return res.status(401).json({ refreshed: false }); // sessionId has been removed from the db (user may have logged out, or we may have revoked access). user will need to re-login
        } catch (e) {
          return res.status(401).json({ refreshed: false }); // refresh token has expired. user will need to re-login
        }

      }

      throw e; // we don't handle other jwt issues. likely a malicious user
    }

  })


export default handler;