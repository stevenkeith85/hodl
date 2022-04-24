import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from "../handler";
import { isValidAddress } from "../../../lib/profile";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getFollowers = memoize(async (address) => {
  console.log("CALLING REDIS TO SEE WHO IS FOLLOWING ADDRESS", address);
  const followers = await client.hkeys(`followers:${address}`)

  return followers;
}, { 
  async: true,
  primitive: true,
  max: 10000, 
});


route.get(async (req: NextApiRequest, res: NextApiResponse) => {  
  const { address } = req.query;

  if (!address || ! (await isValidAddress(address) )) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const followers = await getFollowers(address);
  res.status(200).json({followers});
});


export default route;
