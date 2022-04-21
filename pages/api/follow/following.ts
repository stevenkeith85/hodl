// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from "../handler";
import { isValidAddress } from "../../../lib/profile";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();


export const getFollowing = memoize(async (address) => {
  console.log("CALLING REDIS TO SEE WHO ADDRESS IS FOLLOWING", address);
  const following = await client.hkeys(`following:${address}`)

  return following;
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
