// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect'
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import memoize from 'memoizee';

dotenv.config({ path: '../.env' })

const apiRoute = nextConnect({
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});



// https://docs.upstash.com/redis/troubleshooting/max_concurrent_connections
export const getTokens = memoize(async (tokenId) => {
  // const tokens = [];
  // for (const token of tokenId) {
  //     tokens.push({ "tokenId": token, 
  //                   "name": "Token " + Number(token), 
  //                   "description": token, 
  //                   "image": Number(token) % 2 ? "ipfs://bafkreicb3gm2lu6b5fy64lzmalaqao4dcs7aa3eitpledknvjum5uzay6u" : "ipfs://bafkreiedjgeayh5h7nt3acv6btdjzngphefjlyl7lqfzosejf5kigr6cpe", 
  //                   "phash": "853763601edd684f" },)
  // }

  console.log('CALLING REDIS', tokenId);

  const redis = new Redis(process.env.REDIS_CONNECTION_STRING);

  const pipeline = redis.pipeline();
  for (const token of tokenId) {
      pipeline.get('token:' + token);
  }

  const promise = await pipeline.exec()
  const tokens = promise.map(result => JSON.parse(result[1]))

  await redis.quit();
  return tokens;
}, { length: false, primitive: true, maxAge: 1000 * 60 * 60, max: 10000}); // cache for an hour and a maximum of 10000 items (estimating up to 70 MB of data if we end up with 20 items per cache entry )


apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const tokens = await getTokens(req.query.tokenId);
  res.status(200).json({ tokens })
});


export default apiRoute;
