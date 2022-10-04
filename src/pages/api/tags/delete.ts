import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import { getProvider } from "../../../lib/server/connections";
import { ethers } from "ethers";
import HodlNFT from '../../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import HodlMarket from '../../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json';

const client = Redis.fromEnv()
import apiRoute from "../handler";


dotenv.config({ path: '../.env' })
const route = apiRoute();

// TODO: We don' actually let user's remove tags anymore, as they are added to the metadata
// in the description field.
//
// We may allow them to 'deindex' their tokens from search (i guess); so leaving for now
const removeTokenFromTag = async (tag, token) => {
  const result1 = await client.zrem(`tag:${tag}`, token);
  const result2 = await client.srem(`token:${token}:tags`, tag);
  
  return result1 + result2;
}


route.delete(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { tag, token } = req.body;

  if (!tag || !token) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const provider = await getProvider();
  const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, HodlNFT.abi, provider);

  const tokenExists = await tokenContract.exists(token);
  if (!tokenExists) { 
    return res.status(400).json({ message: 'Bad Request' });
  }

  // Owner (when not listed) or Seller (when listed) can modify tags
  const owner = await tokenContract.ownerOf(token);

  const marketContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, HodlMarket.abi, provider);
  const marketItem = await marketContract.getListing(token);
  const seller = marketItem.seller;

  if (req.address !== owner && req.address !== seller) {
    return res.status(400).json({ message: 'Bad Request' });
  }
  
  const success = await removeTokenFromTag(tag, token);

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(200).json({ message: 'tag not removed from token' });
  }
});


export default route;
