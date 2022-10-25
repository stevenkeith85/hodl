import { NextApiResponse } from "next"

import { Contract } from '@ethersproject/contracts'

import apiRoute from "../handler";
import HodlNFT from '../../../../smart-contracts/artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import HodlMarket from '../../../../smart-contracts/artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import { getProvider } from "../../../lib/server/connections"
import memoize from 'memoizee';
import { Redis } from '@upstash/redis';



const client = Redis.fromEnv();
const route = apiRoute();

const isOwnerOrSeller = async (token, address) => {
  const provider = await getProvider();

  try {
    const tokenContract = new Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, HodlNFT.abi, provider);
    const tokenExists = await tokenContract.exists(token);
    
    if (!tokenExists) {
      return false;
    }

    const marketContract = new Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, HodlMarket.abi, provider);

    const owner = await tokenContract.ownerOf(token);
    const marketItem = await marketContract.getListing(token);
    const seller = marketItem.seller;

    return address === owner || address === seller;

  } catch (e) {
    return false;
  }
}

const getProfilePicture = memoize(async (address) => {
  const token = await client.hget(`user:${address}`, 'avatar');
  return token;
}, {
  primitive: true,
  max: 10000,
});

route.get(async (req, res: NextApiResponse) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'bad request' });
  }

  const token = await getProfilePicture(address);

  const ownsToken = await isOwnerOrSeller(token, address);

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
  if (!token) {
    return res.status(400).json({ error: 'bad request' });
  }

  const ownsToken = await isOwnerOrSeller(token, req.address);
  if (!ownsToken) {
    return res.status(400).json({ error: 'bad request' });
  }

  await client.hset(`user:${req.address}`, { 'avatar': token });

  getProfilePicture.delete(req.address);

  return res.status(200).json({ message: 'ok' });
});

export default route;
