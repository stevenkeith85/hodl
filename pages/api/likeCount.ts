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
//   "token": <tokenId>
// }
// Requests the number of users who like a token
apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
  
  const { token } = req.query;

  try {
    const client = new Redis(process.env.REDIS_CONNECTION_STRING);
    
    console.log("CALLING REDIS TO GET TOKEN LIKE COUNT", token);
    const count = await client.hlen(`likedby:${token}`); // O(1)
    await client.quit();
    
    res.status(200).json({count});
  } catch (error) {
    console.log('ERROR', error);
    res.status(500).json({ error });
  }

});


export default apiRoute;
