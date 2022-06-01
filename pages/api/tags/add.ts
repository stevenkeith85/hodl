import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

import { getProvider } from "../../../lib/server/connections";
import { ethers } from "ethers";
import { nftaddress, nftmarketaddress } from "../../../config";
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import HodlMarket from '../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json';

const client = Redis.fromEnv()
import apiRoute from "../handler";
import { AddTagValidationSchema } from "../../../validationSchema/addTag";
import { MAX_TAGS_PER_TOKEN } from "../../../lib/utils";

dotenv.config({ path: '../.env' })
const route = apiRoute();

const addTokenToTag = async (tag, token) => {
  const total = await client.zcount(`tags:${token}`, '-inf', '+inf');

  if (total >= MAX_TAGS_PER_TOKEN) {
    return 0;
  }

  const result1 = await client.zadd(
    `tag:${tag}`,
    {
      score: Date.now(),
      member: token
    }
  );

  const result2 = await client.zadd(
    `tags:${token}`,
    {
      score: Date.now(),
      member: tag
    }
  );

  return result1 + result2;
}


route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { tag, token } = req.body;

  if (!tag || !token) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const isValid = await AddTagValidationSchema.isValid(req.body)
  if (!isValid) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const provider = await getProvider();
  const tokenContract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
  const tokenExists = await tokenContract.exists(token);
  if (!tokenExists) { 
    return res.status(400).json({ message: 'Bad Request' });
  }

  // Owner (when not listed) or Seller (when listed) can modify tags
  const owner = await tokenContract.ownerOf(token);

  const marketContract = new ethers.Contract(nftmarketaddress, HodlMarket.abi, provider);
  const marketItem = await marketContract.getListing(token);
  const seller = marketItem.seller;

  if (req.address !== owner && req.address !== seller) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const success = await addTokenToTag(tag, token);

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(400).json({ message: 'token not added to tag' });
  }
});


export default route;
