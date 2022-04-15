// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from "../handler";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();


// Find out if adress1 follows address2
// Memo cleared when 'follow' is toggled
export const isFollowing = memoize(async (address1, address2) => {
  console.log("CALLING REDIS TO SEE IF ADDRESS1 IS FOLLOWING ADDRESS2", address1, address2);
  const follows = await client.hexists(`following:${address1}`, address2);
  return follows;
}, { 
  primitive: true,
  max: 10000, 
});

// Returns whether address1 follows address2
route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { address1, address2 } = req.query;

  if (!address1 || !address2) {
    return res.status(400).json({message: 'Bad Request - Missing address'});
  }

  const follows = await isFollowing(address1, address2);
  res.status(200).json({follows});
});


export default route;
