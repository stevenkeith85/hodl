import { NextApiRequest, NextApiResponse } from "next"
import { Redis } from '@upstash/redis'
import dotenv from 'dotenv'
import { messageToSign } from "../../../lib/utils"
import { ethers } from "ethers"
import jwt from 'jsonwebtoken'
import apiRoute from "../handler";
import { getNonceForAddress } from "./nonce"

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

route.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { signature, address } = req.body;

  if (!signature || !address) {
    return res.status(200).json({ error: 'No signed message supplied' });
  }

  console.log("CALLING REDIS TO GET NONCE TO AUTHENTICATE ADDRESS", address);
  const exists = await client.hexists(`user:${address}`, 'nonce');

  if (exists) {
    const nonce = await client.hget(`user:${address}`, 'nonce');
    const msg = messageToSign + nonce;
    const signerAddress = ethers.utils.verifyMessage(msg, signature);

    if (address == signerAddress) {
      const newNonce = `${Math.floor(Math.random() * 1000000)}`;
      await client.hset(`user:${address}`, { 'nonce': newNonce });
      getNonceForAddress.delete(address);

      const token = jwt.sign({ address }, process.env.JWT_SECRET, { expiresIn: 60 * 60 }); // expires every 60 mins

      return res.status(200).json({ success: true, token, address, msg: "You are now logged in." });
    } else {
      return res.status(401).json({ success: false, address, msg: "You didn't provide the correct signature" });
    }
  } else {
    return res.status(400).json({ success: false, address, msg: "You haven't requested a nonce to sign yet" });
  }
});


export default route;
