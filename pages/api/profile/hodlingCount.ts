// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import dotenv from 'dotenv'
import apiRoute from "../handler";

import { ethers } from 'ethers';
import { nftaddress } from '../../../config';
import { getProvider } from '../../../lib/server/connections';
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';

dotenv.config({ path: '../.env' })

const route = apiRoute();

const getHodlingCount = async address => {
  const provider = await getProvider();
  const tokenContract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
  const result = await tokenContract.balanceOf(address);
  return Number(result);
}

// Requests the number of accounts address follows
route.get(async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const count = await getHodlingCount(address);
  res.status(200).json({count});
});


export default route;
