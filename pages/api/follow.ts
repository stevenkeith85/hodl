// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect'
import * as Redis from 'ioredis';
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const apiRoute = nextConnect({
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});


// POST /api/follow
//
// {
//   "address": <address>
//   "addressToFollow": <address>
// }
apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
  
  const { address, addressToFollow } = req.body;

  try {
    const client = new Redis(process.env.REDIS_CONNECTION_STRING);
    const exists = await client.hexists(`following: ${address}`, addressToFollow);

    if (exists) {
      await client.hdel(`following: ${address}`, addressToFollow);
    } else {
      await client.hset(`following: ${address}`, addressToFollow, 1);
    }

    const following = await client.hkeys(`following: ${address}`)
    await client.quit();

    res.status(200).json({following});
  } catch (error) {
    console.log('ERROR', error);
    res.status(500).json({ error });
  }

});


export default apiRoute;
