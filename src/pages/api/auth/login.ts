import { NextApiRequest, NextApiResponse } from "next"
import { Redis } from '@upstash/redis'
import dotenv from 'dotenv'
import { messageToSign } from "../../../lib/utils"
import { ethers } from "ethers"
import jwt from 'jsonwebtoken'
import apiRoute from "../handler";
import { getUuidForAddress } from "./uuid"
import cookie from 'cookie'
import { accessTokenExpiresIn, refreshTokenExpiresIn } from "../../../lib/jwt"
import { User } from "../../../models/User"
import { trimZSet } from "../../../lib/databaseUtils"

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();


// TODO: CSRF checks - get a library


// data structures:
//
// A HASH
// user:<address> = {
//      uuid - a random number appended to our constant welcome message to ensure the user signs a unique string each time
//      sessionId - a random number that tells us if the refresh token is still valid. if not, the user will need to re-login
//      picture - an NFT id to use for the users avatar. TODO - rename this to 'avatar'
// }
//
// A ZSET (id, firstlogin) to record all the addresses that have connected to the site. This is effectively our users list.
// We can use it to check if an address has connected to Hodl My Moon before. If they haven't then their profile URL should 404
//
// e.g. /profile/Ox12345 -> 404 if that address isn't in the set
//
// users = { 1: 12345, 2: 22345, ...}
//
// A ZSET (id, lastlogin) to record all the addresses that have logged in to the site.
//
// users = { 1: 42345, 2: 42345, ...}
//



// <signature> - the message that's been signed with the user's metamask wallet 
// <address> - their wallet address
//
// User must request a message to sign before this step. that request will generate a <uuid>
//
// When authenticating (e.g. in handler.ts), if we get a valid refreshToken, 
// prior to issuing a new (short lived) accessToken; we'll compare the sessionId
// sent in the refreshToken with the one we will store (here) in our database
//
// If they do not match, the user has been logged out. (by us or themselves)
// 
// i.e. clearing the sessionId from the database will correctly prevent us issuing an updated accessToken
route.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { signature, address } = req.body;

  if (!signature || !address) {
    return res.status(200).json({ error: 'Bad request' });
  }

  const uuid = await client.hget(`user:${address}`, 'uuid');

  if (uuid) {
    const signerAddress = ethers.utils.verifyMessage(messageToSign + uuid, signature);

    if (address == signerAddress) {
      // User has connected

      // Create user
      await client.hsetnx(`user:${address}`, 'address', address);
      await client.hsetnx(`user:${address}`, 'nickname', '');
      await client.hsetnx(`user:${address}`, 'avatar', '');
      await client.hsetnx(`user:${address}`, 'nonce', -1); // if we've never seen them, just set their nonce to 0. when we receive their first transaction it will be 0 or higher

      // Update
      const sessionId = Math.floor(Math.random() * 1000000);
      const uuid = Math.floor(Math.random() * 1000000);
      await client.hset(`user:${address}`, {
        sessionId,
        uuid
      });

      // Create access and refresh tokens
      const accessToken = jwt.sign({ address, sessionId },
        process.env.JWT_SECRET,
        { expiresIn: accessTokenExpiresIn }
      );

      const refreshToken = jwt.sign({ sessionId },
        process.env.JWT_SECRET,
        { expiresIn: refreshTokenExpiresIn }
      );

      console.log('AUTH: setting login cookies')
      res.setHeader('Set-Cookie', [
        cookie.serialize('accessToken', accessToken, { httpOnly: true, path: '/' }),
        cookie.serialize('refreshToken', refreshToken, { httpOnly: true, path: '/' })
      ])

      // Log when the user joined
      const timestamp = Date.now();
      const added = await client.zadd(
        `users`,
        { nx: true },
        {
          score: timestamp,
          member: address
        }
      );

      if (added) {
        // Add to the set of new users (limited in size; used on the UI)
        await client.zadd(
          `users:new`,
          { nx: true },
          {
            score: timestamp,
            member: address
          }
        );

        trimZSet(client, 'users:new');
      }

      return res.status(200).json({
        success: true,
        address,
        msg: "You are now logged in."
      });
    } else {
      return res.status(401).json({ success: false, address, msg: "You didn't provide the correct signature" });
    }
  } else {
    return res.status(400).json({ success: false, address, msg: "You haven't requested a uuid to sign yet" });
  }
});


export default route;
