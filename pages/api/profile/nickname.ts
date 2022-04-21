import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import memoize from 'memoizee';
import { getAddress } from "./address";
import apiRoute from "../handler";
import { nicknameValidationSchema } from "../../../validationSchema/nickname";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getNickname = memoize(async (address) => {
  console.log("CALLING REDIS FOR NICKNAME FOR ADDRESS", address);

  const nickname = await client.get(`nickname:${address}`);
  return nickname;
}, {
  primitive: true,
  max: 10000, // store 10,000 nicknames
});


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

  const exists = await client.exists(`address:${nickname}`);

  if (exists) {
    return res.status(400).json({
      message: 'Nickname not available'
    });
  } else {
    const oldNickname = await client.get(`nickname:${req.address}`);

    // set new
    await client.set(`address:${nickname}`, req.address);
    await client.set(`nickname:${req.address}`, nickname);

    // and free up the old one (if we have one)
    if (oldNickname) {
      await client.del(`address:${oldNickname}`);
    }

    // clear cache
    getNickname.delete(req.address);
    getAddress.delete(nickname);
  }

  return res.status(200).json({
    message: `${req.address} now has the nickname: "${nickname}"`
  });
});

export default route;
