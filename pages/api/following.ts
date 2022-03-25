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


// GET /api/following
//
// {
//   "address": <address>
// }
apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
  
  const { address } = req.query;

  try {
    const client = new Redis(process.env.REDIS_CONNECTION_STRING);
    const following = await client.hkeys(`following: ${address}`)
    await client.quit();

    res.status(200).json({following});
  } catch (error) {
    console.log('ERROR', error);
    res.status(500).json({ error });
  }

});


export default apiRoute;
