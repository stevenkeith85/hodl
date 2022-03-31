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


// Find out who is following address
// export this, as we clear the memo when 'follow' is toggled
export const getFollowers = memoize(async (address) => {
  console.log("CALLING REDIS TO SEE WHO IS FOLLOWING ADDRESS", address);
  const client = new Redis(process.env.REDIS_CONNECTION_STRING);
  const followers = await client.hkeys(`followers:${address}`)
  await client.quit();

  return followers;
}, { primitive: true, maxAge: 1000 * 60 * 60, max: 10000, async: true}); // cache for an hour and a maximum of 10000 items


// Returns a list of addresses following 'address' (the followers of address1)
// Used in the following tab on the user profile
// GET /api/following?address=
apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
  
  const { address } = req.query;

  try {
    const followers = await getFollowers(address);

    res.status(200).json({followers});
  } catch (error) {
    console.log('ERROR', error);
    res.status(500).json({ error });
  }

});


export default apiRoute;
