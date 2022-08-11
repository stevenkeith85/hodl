import dotenv from 'dotenv'
import apiRoute from "../handler";
import memoize from 'memoizee';
import { ethers } from 'ethers';
import { nftaddress } from '../../../config';
import { getProvider } from '../../../lib/server/connections';
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';

dotenv.config({ path: '../.env' })

const route = apiRoute();

// TODO: Memoize / Cache ?
export const getHodlingCount = async address => {
  if (!address) {
    return null;
  }

  try {
    const provider = await getProvider();
    const tokenContract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
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
