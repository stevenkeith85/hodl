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


// Find out who address is following
// Memo cleared when 'follow' is toggled
export const getFollowing = memoize(async (address) => {
  console.log("CALLING REDIS TO SEE WHO ADDRESS IS FOLLOWING", address);
  const following = await client.hkeys(`following:${address}`)

  return following;
}, { 
  primitive: true,
  max: 10000, 
});


// Returns a list of addresses that 'address' is following
// Used in the following tab on the user profile
// GET /api/following?address=
route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({message: 'Bad Request - No address supplied'});
  }
  
  if (!(await isValidAddress(address))) {
    return res.status(400).json({message: 'Bad Request - Invalid address'});
  }

  const following = await getFollowing(address);
  res.status(200).json({following});
});


export default route;
