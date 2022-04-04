// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import { trim } from "../../lib/utils";
import { isValidAddress } from "../../lib/profile";
import memoize from 'memoizee';
import { getAddress } from "./address";
import apiRoute from "./handler";

dotenv.config({ path: '../.env' })

const route = apiRoute();

// Gets the nickname for address
// Memo cleared when user changes nickname
export const getNickname = memoize(async (address) => {
    try {
      console.log("CALLING REDIS FOR NICKNAME FOR ADDRESS", address);
      const client = new Redis(process.env.REDIS_CONNECTION_STRING);
      const nickname = await client.get(`nickname:${address}`);
      await client.quit();
      return nickname;
    } catch (e) {
      console.log(e)
    }
}, { 
  primitive: true, 
  max: 10000, // store 10,000 nicknames
});


// GET /api/nickname?address=0x1234
route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({message: 'Bad Request'});
  }
  
  try {
    const nickname = await getNickname(address);
    return res.status(200).json({nickname})
  } catch (e) {
    console.log(e)
  }
});

// POST /api/nickname
route.post(async (req, res) => {
  
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { nickname } = req.body;

  if (!nickname) {
    return res.status(400).json({ message: 'Nickname missing' });
  }

  if (nickname.length < 3 || nickname.length > 20) {
    return res.status(400).json({ message: 'Nickname must be between 3 and 20 characters' });
  }

  if (await isValidAddress(nickname)) {
    return res.status(400).json({
      message: 'Supplied an address, not a nickname'
    });
  }

  // address:steve = 0x1234 (address of steve is 0x1234)
  // nickname:0x1234 = steve (nickname of 0x1234 is steve
  
  const client = new Redis(process.env.REDIS_CONNECTION_STRING);
  const sanitizedNickName = trim(nickname).toLowerCase();
  const exists = await client.exists(`address:${sanitizedNickName}`);

  if (exists) {
    return res.status(400).json({
      message: 'Nickname not available'
    });
  } else {
    const oldNickname = await client.get(`nickname:${req.address}`);

    // set new
    await client.set(`address:${sanitizedNickName}`, req.address);
    await client.set(`nickname:${req.address}`, sanitizedNickName);

    // and free up the old one (if we have one)
    if (oldNickname) {
      await client.del(`address:${oldNickname}`);
    }

    // clear cache
    getNickname.delete(req.address);
    getAddress.delete(sanitizedNickName);
  }

  await client.quit();

  return res.status(200).json({
    message: `${req.address} now has the nickname: "${sanitizedNickName}"`
  });
});

export default route;
