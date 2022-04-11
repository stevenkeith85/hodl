// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from "../handler";
import { isValidAddress } from "../../../lib/profile";

dotenv.config({ path: '../.env' })
const route = apiRoute();


// Find out who is following address
// Memo cleared when 'follow' is toggled
export const getFollowers = memoize(async (address) => {
  console.log("CALLING REDIS TO SEE WHO IS FOLLOWING ADDRESS", address);
  const client = new Redis(process.env.REDIS_CONNECTION_STRING);
  const followers = await client.hkeys(`followers:${address}`)
  await client.quit();

  return followers;
}, { 
  primitive: true,
  max: 10000, 
});


// Returns a list of addresses following 'address' (the followers of address1)
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

  const followers = await getFollowers(address);
  res.status(200).json({followers});
});


export default route;
