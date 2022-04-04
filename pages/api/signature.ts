// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next"
import * as Redis from 'ioredis'
import dotenv from 'dotenv'
import { messageToSign } from "../../lib/utils"
import { ethers } from "ethers"
import jwt from 'jsonwebtoken'
import apiRoute from "./handler";
import { getNonceForAddress } from "./nonce"

dotenv.config({ path: '../.env' })

const route = apiRoute();
route.post(async (req: NextApiRequest, res: NextApiResponse) => {  
  const { signature, address } = req.body;

  if (!signature || !address ) {
    return res.status(200).json({ error: 'No signed message supplied' });
  }

  try {
    console.log("CALLING REDIS TO GET NONCE TO AUTHENTICATE ADDRESS", address);
    
    const client = new Redis(process.env.REDIS_CONNECTION_STRING);
    const exists = await client.hexists(`user:${address}`, 'nonce');

    if (exists) {
      const nonce = await client.hget(`user:${address}`, 'nonce');
      const msg = messageToSign + nonce;
      const signerAddress = ethers.utils.verifyMessage(msg, signature);

      if (address == signerAddress) { // the user asking to authenticate IS the user with access to that wallet
        
        // update their nonce
        const newNonce = `${Math.floor(Math.random() * 1000000)}`;
        await client.hset(`user:${address}`, 'nonce', newNonce);
        getNonceForAddress.delete(address);
        
        // generate a jwt
        // expire every 30 mins for development to help catch bugs. TODO: Update to 24 hours or so
        const token = jwt.sign({address}, process.env.JWT_SECRET, { expiresIn: 60 * 30 });
        
        await client.quit();
        return res.status(200).json({
          success: true,
          token: `Bearer ${token}`,
          address,
          msg: "You are now logged in."
        });
      } else {
        await client.quit();
        return res.status(401).json({
          success: false,
          address,
          msg: "You didn't provide the correct signature"
        });
      }
    } else {
      await client.quit();
      return res.status(400).json({
        success: false,
        address,
        msg: "You haven't requested a nonce to sign yet"
    });
    }
  } catch (error) {
    res.status(500).json({ error });
  }

});


export default route;
