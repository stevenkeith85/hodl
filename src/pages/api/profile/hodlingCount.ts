import dotenv from 'dotenv'
import apiRoute from "../handler";
import { ethers } from 'ethers';
import { getProvider } from '../../../lib/server/connections';
import HodlNFT from '../../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';

dotenv.config({ path: '../.env' })

const route = apiRoute();

export const getHodlingCount = async address => {
  if (!address) {
    return null;
  }

  try {
    const provider = await getProvider();
    const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, HodlNFT.abi, provider);
    const result = await tokenContract.balanceOf(address);
    return Number(result);
  } catch (e) {
    return 0;
  }
};

route.get(async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const count = await getHodlingCount(address);
  res.status(200).json(count);
});


export default route;
