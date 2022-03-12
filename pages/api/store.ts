// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from 'ethers'
import nextConnect from 'next-connect'
import * as Redis from 'ioredis';
import dotenv from 'dotenv'
import { nftaddress } from '../../config';
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'

dotenv.config({ path: '../.env' })

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

let client = new Redis(process.env.REDIS_CONNECTION_STRING);

export const ipfsUriToGatewayUrl = (ipfsUri) => {
  const cid = ipfsUri.split('ipfs://')[1]
  return `https://${cid}.ipfs.infura-ipfs.io`;
}

apiRoute.post(async (req, res) => {
  const { tokenId } = req.body;

  // // no need to trust user. just check ipfs
  const provider = new ethers.providers.JsonRpcProvider()
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)

  const tokenUri = await tokenContract.tokenURI(tokenId);

  const credentials = Buffer.from(process.env.INFURA_IPFS_PROJECT_ID + ':' + process.env.INFURA_IPFS_PROJECT_SECRET).toString('base64');
  var auth = { "Authorization" : `Basic ${credentials}` };

  const r = await fetch(ipfsUriToGatewayUrl(tokenUri), { headers : auth });
  const { name, description, image} = await r.json()
  
  client.set(tokenId, JSON.stringify({ name, description, image }));
  
  res.status(200).json({ tokenId, name, description, image });
});


export default apiRoute;
