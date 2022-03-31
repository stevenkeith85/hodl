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

// Find out if adress1 follows address2
// export this, as we clear the memo when 'follow' is toggled
export const isFollowing = memoize(async (address1, address2) => {
  console.log("CALLING REDIS TO SEE IF ADDRESS1 IS FOLLOWING ADDRESS2", address1, address2);
  const client = new Redis(process.env.REDIS_CONNECTION_STRING);
  const follows = await client.hexists(`following:${address1}`, address2) // O(N) 'following:0x1234' : { 0x5678: 1, 0x9101: 1, ... }
  await client.quit();
  return follows;
}, { primitive: true, maxAge: 1000 * 60 * 60, max: 10000, async: true}); // cache for an hour and a maximum of 10000 items


// Returns whether address1 follows address2
apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { address1, address2 } = req.query;

  try {
    const follows = await isFollowing(address1, address2);

    res.status(200).json({follows});
  } catch (error) {
    console.log('ERROR', error);
    res.status(500).json({ error });
  }

});


export default apiRoute;
