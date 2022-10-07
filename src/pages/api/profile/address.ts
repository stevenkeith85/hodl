import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv();
const route = apiRoute();

// TODO: I don't think this is needed anymore?
export const getAddress = async (nickname) => {    
    const address = await client.get(`nickname:${nickname}`);
    return address;
}

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
