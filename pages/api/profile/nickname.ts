import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import { getAddress } from "./address";
import apiRoute from "../handler";
import { nicknameValidationSchema } from "../../../validationSchema/nickname";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getNickname = async (address) => {
  const nickname = await client.hget(`user:${address}`, 'nickname');
  return nickname;
}

// GET /api/profile/nickname?address=0x1234
route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const nickname = await getNickname(address);
  return res.status(200).json({ nickname })
});

// POST /api/nickname
route.post(async (req, res) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const isValid = await nicknameValidationSchema.isValid(req.body)
  if (!isValid) {
    return res.status(400).json({ message: 'invalid nickname' });
  }

  const { nickname } = req.body;

  const exists = await client.exists(`nickname:${nickname}`);

  if (exists) {
    return res.status(400).json({
      message: 'Nickname not available'
    });
  } else {
    // TODO - REDIS TRANSACTION
    const oldNickname = await client.hget(`user:${req.address}`, 'nickname');

    client.set(`nickname:${nickname}`, req.address);
    client.hset(`user:${req.address}`, {nickname})
    
    if (oldNickname) {
      await client.del(`nickname:${oldNickname}`);
    }
  }

  return res.status(200).json({
    message: `${req.address} now has the nickname: "${nickname}"`
  });
});

export default route;
