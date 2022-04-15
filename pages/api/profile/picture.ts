import { NextApiResponse } from "next"
import dotenv from 'dotenv'
import { ethers } from "ethers"
import apiRoute from "../handler";
import { nftaddress } from "../../../config"
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { getProvider } from "../../../lib/server/connections"
import memoize from 'memoizee';
import { Redis } from '@upstash/redis';

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv();
const route = apiRoute();

const isOwner = async (token, address) => {
  const provider = await getProvider();
  
  try {
    const tokenContract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
    const owner = await tokenContract.ownerOf(token);
    return owner === address;
  } catch(e) { // user might ask for a non-existent token
    return false;
  }
}

const getProfilePicture = memoize(async (address) => {
  console.log("CALLING REDIS TO GET PROFILE PIC FOR ADDRESS", address);
  const token = await client.hget(`user:${address}`, 'picture');
  return token;
}, {
  primitive: true,
  max: 10000, 
});

route.get(async (req, res: NextApiResponse) => {  
    const { address } = req.query;

    if (!address ) {
      return res.status(400).json({ error: 'bad request' });
    }
    
    const token = await getProfilePicture(address);

    const ownsToken = await isOwner(token, address);
    
    // if the user no longer owns the token, we return nothing. (possibly might be better to clear this when there's a token transfer?)
    if (!ownsToken) { 
      return res.status(200).json({ token: null });
    }
      
    return res.status(200).json({ token });
});

route.post(async (req, res: NextApiResponse) => {  
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }
  
  const { token } = req.body;
  if (!token ) {
    return res.status(400).json({ error: 'bad request' });
  }

  const ownsToken = await isOwner(token, req.address);
  if (!ownsToken) {
    return res.status(400).json({ error: 'bad request' });
  }

  console.log("CALLING REDIS TO SET USER'S PROFILE PIC TO NFT", token);
  await client.hset(`user:${req.address}`, {'picture': token});

  getProfilePicture.delete(req.address);

  return res.status(200).json({ message: 'ok' });
});

export default route;
