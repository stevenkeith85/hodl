import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';

import apiRoute from "../handler";
import { nicknameValidationSchema } from "../../../validation/nickname";
import { runRedisTransaction } from "../../../lib/database/rest/databaseUtils";


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

// This could be vulnerable to CSRF. To prevent this we are setting the auth cookies to LAX.
// https://portswigger.net/web-security/csrf/samesite-cookies

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
    const oldNickname = await client.hget(`user:${req.address}`, 'nickname');

    const cmds = [
      ['DEL', `nickname:${oldNickname}`],
      ['SET', `nickname:${nickname}`, req.address],
      ['HSET', `user:${req.address}`, 'nickname', nickname],
    ];

    const success = await runRedisTransaction(cmds);

    if (success) {
      return res.status(200).json({
        message: `${req.address} now has the nickname: "${nickname}"`
      });
    } else {
      return res.status(500).json({ message: `error updating nickname` });
    }
  }


});

export default route;
