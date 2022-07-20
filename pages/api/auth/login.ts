import { NextApiRequest, NextApiResponse } from "next"
import { Redis } from '@upstash/redis'
import dotenv from 'dotenv'
import { messageToSign } from "../../../lib/utils"
import { ethers } from "ethers"
import jwt from 'jsonwebtoken'
import apiRoute from "../handler";
import { getNonceForAddress } from "./nonce"
import cookie from 'cookie'
import { accessTokenExpiresIn, refreshTokenExpiresIn } from "../../../lib/jwt"

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

// We aren't using localStorage anymore; the jwt will be added to the user's cookies so that
// it is automatically sent with every request. This will allow us to check if they are logged in before
// returning the initial response.
//
// This allows us to prevent the 'flicker' you get whilst the auth check happens client-side (we check for 'address' in the context)
//
// it also allows us to fetch more data in getServerSideProps - as some data needs to know the address
//
// TODO: CSRF checks - get a library


// data structures:
//
// user:<address> = {
//      nonce - a random number appended to our constant welcome message to ensure the user signs a unique string each time
//      sessionId
// }

// <signature> - the message that's been signed with the user's metamask wallet 
// <address> - their wallet address
//
// User must request a message to sign before this step. that request will generate a <nonce>
route.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { signature, address } = req.body; 

  if (!signature || !address) {
    return res.status(200).json({ error: 'No signed message supplied' });
  }

  const exists = await client.hexists(`user:${address}`, 'nonce');

  if (exists) {
    const nonce = await client.hget(`user:${address}`, 'nonce');

    const signerAddress = ethers.utils.verifyMessage(messageToSign + nonce, signature);

    if (address == signerAddress) {
      // Ensure the nonce is different when the next login attempt is made
      const newNonce = `${Math.floor(Math.random() * 1000000)}`;
      await client.hset(`user:${address}`, { 'nonce': newNonce });
      getNonceForAddress.delete(address);

      // When authenticating (e.g. in handler.ts), if we get a valid refreshToken, 
      // prior to issuing a new (short lived) accessToken; we'll compare the sessionId
      // sent in the refreshToken with the one we will store (here) in our database
      //
      // If they do not match, the user has been logged out. (by us or themselves)
      // 
      // i.e. clearing the sessionId from the database will correctly prevent us issuing an updated accessToken
      const sessionId = Math.floor(Math.random() * 1000000);
      await client.hset(`user:${address}`, { 'sessionId': sessionId });

      const accessToken = jwt.sign(
        { address, sessionId }, process.env.JWT_SECRET, { expiresIn: accessTokenExpiresIn }
      );

      const refreshToken = jwt.sign(
        { sessionId }, process.env.JWT_SECRET, { expiresIn: refreshTokenExpiresIn }
      );

      res.setHeader('Set-Cookie', [
        cookie.serialize('accessToken', accessToken, { httpOnly: true, path: '/' }),
        cookie.serialize('refreshToken', refreshToken, { httpOnly: true, path: '/' })
      ])

      return res.status(200).json({ 
        success: true, 
        // token: accessToken, 
        address, 
        msg: "You are now logged in." 
      });
    } else {
      return res.status(401).json({ success: false, address, msg: "You didn't provide the correct signature" });
    }
  } else {
    return res.status(400).json({ success: false, address, msg: "You haven't requested a nonce to sign yet" });
  }
});


export default route;
