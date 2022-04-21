import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import { trim } from "../../../lib/utils";
import memoize from 'memoizee';
import apiRoute from "../handler";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv();
const route = apiRoute();


export const getAddress = memoize(async (nickname) => {
    console.log("CALLING REDIS FOR ADDRESS FOR NICKNAME", nickname);
    const address = await client.get(`address:${nickname}`);
    return address;
}, { 
  primitive: true, 
  max: 10000
});

// GET /api/address?nickname=steve
route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { nickname } = req.query;

  if (!nickname) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const address = await getAddress(nickname);

  return res.status(200).json({address})
});


export default route;
