// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from 'ethers'
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import { nftaddress } from '../../config';
import NFT from '../../artifacts/contracts/HodlNFT.sol/HodlNFT.json'
import { ipfsUriToGatewayUrl } from "../../lib/utils";
import cloudinary from 'cloudinary'
import memoize from 'memoizee';
import apiRoute from "./handler";
import { getTokenUriAndOwner } from "../../lib/server/nft";

dotenv.config({ path: '../.env' })

const route = apiRoute();

// @ts-ignore
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
// });

const getInfuraIPFSAuth = memoize(() => {
  const credentials = Buffer.from(process.env.INFURA_IPFS_PROJECT_ID + ':' + process.env.INFURA_IPFS_PROJECT_SECRET).toString('base64');
  var auth = { "Authorization" : `Basic ${credentials}` };
  return auth;
});

route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const {tokenId, mimeType, filter} = req.body;
  const {tokenUri, owner} = await getTokenUriAndOwner(tokenId);

  if (owner !== req.address) {
    return res.status(403).json({ message: "Only the token owner can add their token to HodlMyMoon" });
  }

  const r = await fetch(ipfsUriToGatewayUrl(tokenUri), { headers : getInfuraIPFSAuth() }); // Potentially, we don't want to do it this way (as rate limiting / slow / etc)
  const { name, description, image } = await r.json()

  const client = new Redis(process.env.REDIS_CONNECTION_STRING);
  client.set("token:" + tokenId, JSON.stringify({ tokenId, name, description, image, mimeType, filter }));
  await client.quit();

  res.status(200).json({ tokenId, name, description, image });
});


export default route;
