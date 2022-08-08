import { NextApiRequest, NextApiResponse } from "next";

import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from '../handler';
//
// This is used for getting a 'minimal' NFT. i.e. only what we've stored in Redis (NOT the data from the blockchain).
// We use this for operations that don't need blockchain data
//

import { Redis } from '@upstash/redis';
import { isValid } from "date-fns";
import { isValidAddress } from "../../../lib/profile";
import { User } from "../../../models/User";
import { Token } from "../../../models/Token";
import { ipfsUriToCid } from "../../../lib/utils";
import { isOwnerOrSeller } from "../nft/[tokenId]";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getUser = async (handle) : Promise<User | null> => {

  if (!handle) {
    return null;
  }
  
  const isAddress = await isValidAddress(handle);

  // if we have an address, just look it up
  // TODO - We should check the 'users' collection first; as the user may have a nonce entry; but they've not actually signed the message to connect to the site
  if (isAddress) {
    const user = await client.hmget<User>(`user:${handle}`, 'address', 'nickname', 'avatar');
    
    // if we haven't seen this user before, then just return basic info.
    // this shouldn't actually happen. doing it to allow us to populate the db with dummy addresses
    // to do some load testing
    //
    // TODO: We should probably return null, and make sure the UI handles that, as we don't want a lot of dummy profiles
    if(!user) {
      return {
        address: handle,
        nickname: null,
        avatar: null
      }
    }
    
    if (user?.avatar) {
      // check if the user still owns this token
      const ownsToken = await isOwnerOrSeller(user.address, user.avatar);

      if (ownsToken) {
        user.avatar = await client.get<Token>(`token:${user.avatar}`);
        user.avatar.image = ipfsUriToCid(user.avatar.image);
      } else {
        user.avatar = null;
      }
    }

    console.log('user is ', user)
    return user;
  }

  // otherwise, try getting the address from the nicknames
  const address = await client.get(`nickname:${handle}`);
  if (address) {
    const user = await client.hmget<User>(`user:${address}`, 'address', 'nickname', 'avatar');

    if (user.avatar) {
      user.avatar = await client.get<Token>(`token:${user.avatar}`);
      user.avatar.image = ipfsUriToCid(user.avatar.image);
    }

    return user;
  }

  // we can't find anything
  return null;
}


route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { handle } = req.query;

  if (!handle) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const user = await getUser(handle);
  res.status(200).json({ user })
});

export default route;
