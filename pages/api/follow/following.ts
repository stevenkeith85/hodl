// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from "../handler";
import { isValidAddress } from "../../../lib/profile";
import axios from 'axios'

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();


export const getFollowing = memoize(async (address) => {
  const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/following:${address}/+inf/-inf/rev/byscore`, {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
    }
  })

  return r.data.result;
}, { 
  primitive: true,
  max: 10000, 
});


route.get(async (req: NextApiRequest, res: NextApiResponse) => {  
  const { address } = req.query;

  if (!address || ! (await isValidAddress(address) )) {
    return res.status(400).json({message: 'Bad Request'});
  }
  
  const following = await getFollowing(address);
  res.status(200).json({following});
});


export default route;
