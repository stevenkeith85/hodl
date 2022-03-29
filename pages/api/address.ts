// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect'
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import { trim } from "../../lib/utils";

dotenv.config({ path: '../.env' })

const apiRoute = nextConnect({
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});


// GET /api/address?nickname=steve
apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { nickname } = req.query;
    const sanitizedNickName = trim(nickname).toLowerCase();
    const client = new Redis(process.env.REDIS_CONNECTION_STRING);
    const address = await client.get(`address:${sanitizedNickName}`);
    await client.quit();
    return res.status(200).json({address})
  } catch (e) {
    console.log(e)
  }
});


export default apiRoute;
