// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect'
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
const getNickname = memoize(async (address) => {
    try {
      const client = new Redis(process.env.REDIS_CONNECTION_STRING);
      console.log("CALLING REDIS FOR NICKNAME FOR ADDRESS", address);
      const nickname = await client.get(`nickname:${address}`); // O(1)
      await client.quit();
      return nickname;
    } catch (e) {
      console.log(e)
    }
}, { primitive: true, maxAge: 1000 * 60 * 60, max: 10000, async: true}); // cache for an hour and a maximum of 10000 items

// TODO: SANITISE ADDRESS / DO AUTHENTICATION

// GET /api/nickname?address=0x1234
route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query;
  
  try {
    const nickname = await getNickname(address);
    return res.status(200).json({nickname})
  } catch (e) {
    console.log(e)
  }
});

// POST /api/nickname
route.post(async (req: NextApiRequest, res: NextApiResponse) => {
  
  const { address, nickname } = req.body;

  if (await isValidAddress(nickname)) {
    return res.status(200).json({set: false, message: 'That looks like a valid address, and not a nickname'})
  }

  // address:steve = 0x1234 (address of steve is 0x1234)
  // nickname:0x1234 = steve (nickname of 0x1234 is steve
  try {
    const client = new Redis(process.env.REDIS_CONNECTION_STRING);
    const sanitizedNickName = trim(nickname).toLowerCase();
    const exists = await client.exists(`address:${sanitizedNickName}`); // O(1)

    if (exists) {
      return res.status(200).json({set: false, message: 'That nickname is already taken'})
    } else {
      const oldNickname = await client.get(`nickname:${address}`); // O(1)

      // set new
      await client.set(`address:${sanitizedNickName}`, address); // O(1)
      await client.set(`nickname:${address}`, sanitizedNickName); // O(1)

      // and free up the old one (if we have one)
      if (oldNickname) {
        await client.del(`address:${oldNickname}`); // O(1)
      }

      // clear cache
      getNickname.delete(address, true);
      getAddress.delete(sanitizedNickName, true);
    }

    await client.quit();

    return res.status(200).json({set: true, message: `Nickname "${sanitizedNickName}" is now associated with address ${address}`})
  } catch (error) {
    console.log('ERROR', error);
    res.status(500).json({ error });
  }

});

export default route;
