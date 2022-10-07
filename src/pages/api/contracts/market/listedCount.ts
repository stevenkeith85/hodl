import dotenv from 'dotenv'
import apiRoute from "../../handler";

import { ethers } from 'ethers';
import { getProvider } from '../../../../lib/server/connections';
import HodlMarket from '../../../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json';

dotenv.config({ path: '../.env' })

const route = apiRoute();

export const getListedCount = async address => {
  if (!address) {
    return null;
  }
  try {
    const provider = await getProvider();
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, HodlMarket.abi, provider);
    const result = await contract.balanceOf(address);
    return Number(result);
  } catch (e) {
    return 0;
  }
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
