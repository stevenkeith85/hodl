// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect'
import * as Redis from 'ioredis';
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const apiRoute = nextConnect({
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

let redis = new Redis(process.env.REDIS_CONNECTION_STRING);


apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { tokenId } = req.query;
  
  const tokens = [];
  for (const token of tokenId) {
      tokens.push({ "tokenId": token, 
                    "name": "Token " + Number(token), 
                    "description": token, 
                    "image": Number(token) % 2 ? "ipfs://bafkreicb3gm2lu6b5fy64lzmalaqao4dcs7aa3eitpledknvjum5uzay6u" : "ipfs://bafkreiedjgeayh5h7nt3acv6btdjzngphefjlyl7lqfzosejf5kigr6cpe", 
                    "phash": "853763601edd684f" },)
  }

  // console.log('CALLING REDIS');

  // const pipeline = redis.pipeline();
  // for (const token of tokenId) {
  //     pipeline.get('token:' + token);
  // }

  // const promise = await pipeline.exec()
  // const tokens = promise.map(result => JSON.parse(result[1]))
  res.status(200).json({ tokens })
});


export default apiRoute;
