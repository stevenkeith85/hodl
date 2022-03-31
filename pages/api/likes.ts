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

// Find out if adress likes token
// export this, as we will clear the memo when 'like' is toggled
export const likesToken = memoize(async (address, token) => {
  console.log("CALLING REDIS TO SEE IF ADDRESS LIKES TOKEN", address, token);
  const client = new Redis(process.env.REDIS_CONNECTION_STRING);
  const likes = await client.hexists(`likes:${address}`, token);
  await client.quit();
  return likes;
}, { primitive: true, maxAge: 1000 * 60 * 60, max: 10000, async: true}); // cache for an hour and a maximum of 10000 items


// Returns whether address1 follows address2
apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, token } = req.query;

  try {
    const likes = await likesToken(address, token);

    res.status(200).json({likes});
  } catch (error) {
    console.log('ERROR', error);
    res.status(500).json({ error });
  }

});


export default apiRoute;
