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

dotenv.config({ path: '../.env' })

const route = apiRoute();

// @ts-ignore
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const getInfuraIPFSAuth = memoize(() => {
  const credentials = Buffer.from(process.env.INFURA_IPFS_PROJECT_ID + ':' + process.env.INFURA_IPFS_PROJECT_SECRET).toString('base64');
  var auth = { "Authorization" : `Basic ${credentials}` };
  return auth;
});


// POST /api/store
//
// {
//   "tokenId": <number>
// }
route.post(async (req: NextApiRequest, res: NextApiResponse) => {
  
  const { tokenId, mimeType, filter } = req.body;

  console.log('mimeType', mimeType)
  try {
    const client = new Redis(process.env.REDIS_CONNECTION_STRING);

    // TODO: The ethers stuff should be moved to nft.js
    const provider = new ethers.providers.JsonRpcProvider("http://192.168.1.242:8545")
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    
    // This is important! We only want to store HodlNFTs in our database at the moment. 
    // If a user tries to create spoof tokens and list on the market, we
    // won't show them on the website as we use the HodlNFT contract as the source of truth!

    const tokenUri = await tokenContract.tokenURI(tokenId);
    const r = await fetch(ipfsUriToGatewayUrl(tokenUri), { headers : getInfuraIPFSAuth() }); // Potentially, we don't want to do it this way (as rate limiting / slow / etc)
    const { name, description, image } = await r.json()

    client.set("token:" + tokenId, JSON.stringify({ tokenId, name, description, image, mimeType, filter }));
    
    await client.quit(); // https://docs.upstash.com/redis/troubleshooting/max_concurrent_connections

    res.status(200).json({ tokenId, name, description, image });
  } catch (error) {
    console.log('ERROR', error);
    res.status(500).json({ error });
  }

});


export default route;
