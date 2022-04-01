// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect'
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from "./handler";

dotenv.config({ path: '../.env' })
const route = apiRoute();

// const apiRoute = nextConnect({
//   onNoMatch(req: NextApiRequest, res: NextApiResponse) {
//     res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
//   },
// });


// Find out who address is following
// export this, as we clear the memo when 'follow' is toggled
export const getFollowing = memoize(async (address) => {
  console.log("CALLING REDIS TO SEE WHO ADDRESS IS FOLLOWING", address);
  const client = new Redis(process.env.REDIS_CONNECTION_STRING);
  const following = await client.hkeys(`following:${address}`) // O(N) 'following:0x1234' : { 0x5678: 1, 0x9101: 1, ... }
  await client.quit();

  return following;
}, { primitive: true, maxAge: 1000 * 60 * 60, max: 10000, async: true}); // cache for an hour and a maximum of 10000 items


// Returns a list of addresses that 'address' is following
// Used in the following tab on the user profile
// GET /api/following?address=
route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  
  const { address } = req.query;

  try {
    const following = await getFollowing(address);

    res.status(200).json({following});
  } catch (error) {
    console.log('ERROR', error);
    res.status(500).json({ error });
  }

});


export default route;
