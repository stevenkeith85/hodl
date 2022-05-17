import { NextApiRequest, NextApiResponse } from "next"
import { Redis } from '@upstash/redis'
import dotenv from 'dotenv'
import { messageToSign } from "../../../lib/utils"
import { ethers } from "ethers"
import jwt from 'jsonwebtoken'
import apiRoute from "../handler";
import { getNonceForAddress } from "./nonce"
import cookie from 'cookie'

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

// Should really just be 'login'
route.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { signature, address } = req.body;

  if (!signature || !address) {
    return res.status(200).json({ error: 'No signed message supplied' });
  }

  const exists = await client.hexists(`user:${address}`, 'nonce');

  if (exists) {
    const nonce = await client.hget(`user:${address}`, 'nonce');
    const msg = messageToSign + nonce;
    const signerAddress = ethers.utils.verifyMessage(msg, signature);

    if (address == signerAddress) {
      const newNonce = `${Math.floor(Math.random() * 1000000)}`;
      await client.hset(`user:${address}`, { 'nonce': newNonce });
      getNonceForAddress.delete(address);

      // Create a session in the db here
      const sessionId = `${Math.floor(Math.random() * 1000000)}`;
      await client.hset(`user:${address}`, { 'sessionId': sessionId });

      const accessToken = jwt.sign(
        { address, sessionId }, process.env.JWT_SECRET, { expiresIn: 60 * 30} // expires every 30 mins
      ); 

      const refreshToken = jwt.sign(
        { sessionId }, process.env.JWT_SECRET, { expiresIn: 60 * 240 } // expires every 4 hours
      ); 

      res.setHeader('Set-Cookie', cookie.serialize('refreshToken', refreshToken, { httpOnly: true, path: '/' }))

      return res.status(200).json({ success: true, token: accessToken, address, msg: "You are now logged in." });
    } else {
      return res.status(401).json({ success: false, address, msg: "You didn't provide the correct signature" });
    }
  } else {
    return res.status(400).json({ success: false, address, msg: "You haven't requested a nonce to sign yet" });
  }
});


export default route;
