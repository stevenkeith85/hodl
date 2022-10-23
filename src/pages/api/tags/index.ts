import { NextApiRequest, NextApiResponse } from "next";

import dotenv from 'dotenv'
import apiRoute from '../handler';
import { Redis } from '@upstash/redis';
import { getProvider } from "../../../lib/server/connections";
import { ethers } from "ethers";
import HodlNFT from '../../../../smart-contracts/artifacts/contracts/HodlNFT.sol/HodlNFT.json';
dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getTagsForToken = async token => {
  const tags = await client.smembers(`token:${token}:tags`); // O(n) but n can only be 6 items or less
  console.log('tags/index/getTagsForToken - tags ===', tags);
  return tags;
}

route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const token = Array.isArray(req.query.token) ? req.query.token[0] : req.query.token;

  if (!token) {
    return res.status(400).json({message: 'Bad Request'});
  }

  if (!parseInt(token as string)) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const provider = await getProvider();
  const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, HodlNFT.abi, provider);
  const tokenExists = await tokenContract.exists(token);
  if (!tokenExists) { 
    return res.status(400).json({ message: 'Bad Request' });
  }

  const tags = await getTagsForToken(token);
  res.status(200).json(tags)
});

export default route;
