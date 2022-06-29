import { NextApiRequest, NextApiResponse } from "next";

import dotenv from 'dotenv'
import apiRoute from '../handler';
import { Redis } from '@upstash/redis';
import { getProvider } from "../../../lib/server/connections";
import { ethers } from "ethers";
import { nftaddress } from "../../../config";
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import memoize from 'memoizee';
dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getTagsForToken = memoize(async token => {
  const tags = await client.zrange(`tags:${token}`, 0, -1);
  return tags;
}, { 
  async: true,
  primitive: true,
  max: 10000, 
});

route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const token = Array.isArray(req.query.token) ? req.query.token[0] : req.query.token;

  if (!token) {
    return res.status(400).json({message: 'Bad Request'});
  }

  if (!parseInt(token as string)) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const provider = await getProvider();
  const tokenContract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
  const tokenExists = await tokenContract.exists(token);
  if (!tokenExists) { 
    return res.status(400).json({ message: 'Bad Request' });
  }

  const tags = await getTagsForToken(token);
  res.status(200).json(tags)
});

export default route;
