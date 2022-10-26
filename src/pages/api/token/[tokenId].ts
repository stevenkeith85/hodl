import { NextApiRequest, NextApiResponse } from "next";
import memoize from 'memoizee';
import apiRoute from '../handler';
//
// This is used for getting a 'minimal' NFT. i.e. only what we've stored in Redis (NOT the data from the blockchain).
// We use this for operations that don't need blockchain data
//

import { Redis } from '@upstash/redis';
import { Token } from "../../../models/Token";


const client = Redis.fromEnv()
const route = apiRoute();

export const getToken = async (tokenId) => {
  if (!tokenId) {
    return null;
  }

  const token: Token = await client.get<Token>('token:' + tokenId);

  if (!token) {
    return null;
  }
  
  return token;
}

route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { tokenId } = req.query;

  if (!tokenId) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const token = await getToken(tokenId);
  res.status(200).json({ token })
});

export default route;
