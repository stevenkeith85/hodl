import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
// import dotenv from 'dotenv'
import { getProvider } from "../../../lib/server/connections";
import { ethers } from "ethers";
import HodlNFT from '../../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import HodlMarket from '../../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import apiRoute from "../handler";
import { AddTagValidationSchema } from "../../../validation/addTag";
import { MAX_TAGS_PER_TOKEN } from "../../../lib/utils";
import { trimZSet } from "../../../lib/databaseUtils";

// dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

// TODO: Use setnx etc where possible, and return the value
// We can use that information in the caller to early abort things if need be
// Useful for idempotence etc
export const addTokenToTag = async (tag, token) => {
  // Just checking this here, in case we call this from another endpoint that doesn't properly validate input
  const isValid = await AddTagValidationSchema.isValid({ tag, token });

  if (!isValid) {
    return 0;
  }

  const lowerCaseTag = tag.toLowerCase()

  const numberOfTagsOnToken = await client.scard(`token:${token}:tags`);
  if (numberOfTagsOnToken >= MAX_TAGS_PER_TOKEN) {
    return 0;
  }

  const tagTimeSet = await client.zadd(`tag:${lowerCaseTag}`, {
    score: Date.now(),
    member: token
  });

  // Also add it to a set that we will keep trimmed for UI lookups
  const tagTimeSetUI = await client.zadd(`tag:${lowerCaseTag}:new`,
    {
      score: Date.now(),
      member: token
    });
  trimZSet(client, `tag:${lowerCaseTag}:new`);

  // update our top tags list
  const tagCount = await client.zincrby('rankings:tag:count', 1, lowerCaseTag);
  trimZSet(client, 'rankings:tag:count');

  const tokensTags = await client.sadd(`token:${token}:tags`, lowerCaseTag);

  return tagTimeSet + tokensTags;
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

  const success = await addTokenToTag(tag, token);

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(400).json({ message: 'token not added to tag' });
  }
});


export default route;
