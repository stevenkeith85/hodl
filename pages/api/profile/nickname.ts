import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import { trim } from "../../../lib/utils";
import { isValidAddress } from "../../../lib/profile";
import memoize from 'memoizee';
import { getAddress } from "./address";
import apiRoute from "../handler";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

// Gets the nickname for address
// Memo cleared when user changes nickname
export const getNickname = memoize(async (address) => {
    try {
      console.log("CALLING REDIS FOR NICKNAME FOR ADDRESS", address);
      
      const nickname = await client.get(`nickname:${address}`);
      return nickname;
    } catch (e) {
      console.log(e)
    }
}, { 
  primitive: true, 
  max: 10000, // store 10,000 nicknames
});


// GET /api/profile/nickname?address=0x1234
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

  if (nickname.length < 3 || nickname.length > 30) {
    return res.status(400).json({ message: 'Nickname must be between 3 and 30 characters' });
  }

  if (await isValidAddress(nickname)) {
    return res.status(400).json({
      message: 'Supplied an address, not a nickname'
    });
  }

  // We remove whitespace at either side of the nickname, lowercase it, and compress multiple spaces into one
  // i.e. " Steven     Keith " -> "steven keith"
  //
  // This is to just limit users attempting to create 'spoof accounts' as HTML will compress white space, so we'd end up displaying
  // "Steven     Keith" the same way as "Steven Keith" in a lot of places
  //
  // Also, users might not notice small differences like case sensitivity
  
  const sanitizedNickName = trim(nickname).toLowerCase().replace(/\s\s+/g, ' ');
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

  return res.status(200).json({
    message: `${req.address} now has the nickname: "${sanitizedNickName}"`
  });
});

export default route;
