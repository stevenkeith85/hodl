import dotenv from 'dotenv'
import apiRoute from "../../../handler";

import { ethers } from 'ethers';
import { getProvider } from '../../../../../lib/server/connections';
import HodlMarket from '../../../../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import { Redis } from '@upstash/redis';

dotenv.config({ path: '../.env' })

const route = apiRoute();
const client = Redis.fromEnv()


export const getListedCount = async (address, skipCache = false): Promise<number> => {
  if (!address) {
    return null;
  }

  let listedCount = skipCache ? null : await client.get<number>(`user:${address}:listed`);

  if (listedCount === null) {
    console.log('getListedCount - cache miss - reading blockchain');

    try {
      const provider = await getProvider();
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, HodlMarket.abi, provider);
      listedCount = Number(await contract.balanceOf(address));

      client.setex(`user:${address}:listed`, 120, listedCount);
    }
    catch (e) {
      return null;
    }
  } else {
    console.log('getListedCount - cache hit - reading redis');
  }

  return listedCount;
}

// Requests the number of accounts address follows
route.get(async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const count = await getListedCount(address);
  res.status(200).json(count);
});


export default route;
