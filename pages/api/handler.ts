import { NextApiRequest, NextApiResponse } from "next";

import nc from 'next-connect'


import requestIp from 'request-ip'

import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { accessTokenExpiresIn, apiAuthenticate, authenticate } from "../../lib/jwt";


dotenv.config({ path: '../.env' })

export interface HodlApiRequest extends NextApiRequest {
  address: string | null
}

const client = Redis.fromEnv();


// const authenticate = async (req, res, next) => {
//   const { accessToken, refreshToken } = req.cookies;

//   if (!accessToken || !refreshToken) {
//     return next();
//   }

//   try {
//     const { address } = jwt.verify(accessToken, process.env.JWT_SECRET);
//     req.address = address;
//     return next();
//   } catch (e) {
//     if (e instanceof jwt.TokenExpiredError) {
//       try {
//         const { sessionId } = jwt.verify(refreshToken, process.env.JWT_SECRET);
//         const { address } = jwt.decode(accessToken);

//         const storedSessionId = await client.hget(`user:${address}`, 'sessionId');

//         // The sessionId that was set in the (longer lasting) refreshToken matches what we have in the database; so this looks legit
//         // Give the user a new accessToken
//         if (sessionId == storedSessionId) { 
//           const accessToken = jwt.sign({ address, sessionId }, process.env.JWT_SECRET, { expiresIn: accessTokenExpiresIn });

//           res.setHeader('Set-Cookie', [
//             cookie.serialize('accessToken', accessToken, { httpOnly: true, path: '/' }),
//           ])

//           return res.status(401).json({ refreshed: true, 
//             // accessToken 
//           }); 
//         }

//         // the sessionId does not match the storedSessionId
//         // the user has been logged out; by themselves - or us
//         // user will need to re-login
//         return res.status(401).json({ refreshed: false }); 
//       } catch (e) {
//         // the verify call has failed, i.e. the refreshToken has expired. 
//         // the user will need to re-login
//         return res.status(401).json({ refreshed: false }); 
//       }
//     }

//     // This is unlikely to happen in the wild; but if it does; just log the user out
//     // WE usually see it when switching from dev to prod mode (as we have a different jwt secret for both); 
//     if (e instanceof jwt.JsonWebTokenError) {
//       return res.status(401).json({ refreshed: false });
//     }

//     // just log them out if there's any issue we aren't handling
//     return res.status(401).json({ refreshed: false });
//   }
// }

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
  } else {
    console.log('no limit', routeKey)
  }
  
  next();
}

// Comment out for development to save db calls
// TODO: Go through every route and make sure we haven't missed any
const rateLimits = {
  // 'POST:/api/mint/upload': 3,
  // 'POST:/api/mint/ipfs': 1,
  // 'POST:/api/like/like': 2,
  // 'POST:/api/follow/follow': 10,

  'GET:/api/tags': 30,
  'POST:/api/tags/add': 6,
  'DELETE:/api/tags/delete': 6,
  
  'GET:/api/comments': 90,
  'GET:/api/comments/count': 90,
  'POST:/api/comments/add': 6,
  'DELETE:/api/comments/delete': 6,
  
  // 'GET:/api/search/results': 60,
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
    // TODO: Write this error somewhere. Perhaps REDIS
    console.log('API Route Error', 'address: ', req.address, 'path: ', req.url, 'error: ', error)
    res.status(500).json(error);
  }
})
  .use(ratelimit)
  .use(apiAuthenticate)


export default handler;