import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import { trim } from "../../../lib/utils";
import memoize from 'memoizee';
import apiRoute from "../handler";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv();
const route = apiRoute();

// Memo cleared when a new nickname is set
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

  const sanitizedNickName = trim(nickname).toLowerCase();
  const address = await getAddress(sanitizedNickName);

  return res.status(200).json({address})
});


export default route;
