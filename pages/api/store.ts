// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from 'ethers'
import nextConnect from 'next-connect'
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import { nftaddress } from '../../config';
import NFT from '../../artifacts/contracts/HodlNFT.sol/HodlNFT.json'
import { ipfsUriToGatewayUrl } from "../../lib/nft";
import cloudinary from 'cloudinary'

dotenv.config({ path: '../.env' })

const apiRoute = nextConnect({
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

let client = new Redis(process.env.REDIS_CONNECTION_STRING);


// @ts-ignore
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { tokenId } = req.body;

  try {
    // TODO: The ethers stuff should be moved to nft.js
    const provider = new ethers.providers.JsonRpcProvider("http://192.168.1.242:8545")
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)

    // This is important! We only want to store HodlNFTs in our database at the moment. 
    // If a user tries to create spoof tokens and list on the market, we
    // won't show them on the website as we use the HodlNFT contract as the source of truth!
    const tokenUri = await tokenContract.tokenURI(tokenId);

    const credentials = Buffer.from(process.env.INFURA_IPFS_PROJECT_ID + ':' + process.env.INFURA_IPFS_PROJECT_SECRET).toString('base64');
    var auth = { "Authorization" : `Basic ${credentials}` };

    console.log('store', tokenUri);
    const r = await fetch(ipfsUriToGatewayUrl(tokenUri), { headers : auth });
    const { name, description, image} = await r.json()

    const public_id = 'nfts/' + image.split('//')[1];
    console.log('public_id', public_id);
    cloudinary.v2.api.resource(public_id, { phash: true }, (error, result) => {

      console.log('ERROR', error);
      console.log('RESULT', result.phash);
      client.set("token:" + tokenId, JSON.stringify({ tokenId, name, description, image, phash: result.phash }));

      res.status(200).json({ tokenId, name, description, image });
    });
    
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});


export default apiRoute;
