// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect'
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import apiRoute from "./handler";

dotenv.config({ path: '../.env' })

const route = apiRoute();

route.get(async (req: NextApiRequest, res: NextApiResponse) => {  
  const { address } = req.query;

  console.log('getting nonce')
  if (!address) {
    return res.status(200).json({ error: 'No address supplied' });
  }

  try {
    console.log("CALLING REDIS TO GET NONCE FOR ADDRESS", address);
    const client = new Redis(process.env.REDIS_CONNECTION_STRING);
    const exists = await client.hexists(`user:${address}`, 'nonce'); // O(1)

    let nonce = null;

    if (exists) {
      nonce = await client.hget(`user:${address}`, 'nonce'); // O(1)
    } else {
      nonce = `${Math.floor(Math.random() * 1000000)}`;
      await client.hset(`user:${address}`, 'nonce', nonce); // O(1)
    }

    await client.quit();
    
    res.status(200).json({nonce});
  } catch (error) {
    res.status(500).json({ error });
  }

});


export default route;
