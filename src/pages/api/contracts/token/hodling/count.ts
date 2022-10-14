import dotenv from 'dotenv'
import apiRoute from "../../../handler";
import { ethers } from 'ethers';
import { getProvider } from '../../../../../lib/server/connections';
import HodlNFT from '../../../../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { Redis } from '@upstash/redis';

dotenv.config({ path: '../.env' })

const route = apiRoute();
const client = Redis.fromEnv()


export const getHodlingCount = async (address, skipCache = false): Promise<number> => {
  if (!address) {
    return null;
  }

  let hodlingCount = skipCache ? null : await client.get<number>(`user:${address}:hodling`);

  if (hodlingCount === null) {
    console.log('getHodlingCount - cache miss - reading blockchain');

    try {
      const provider = await getProvider();
      const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, HodlNFT.abi, provider);

      hodlingCount = Number(await tokenContract.balanceOf(address));

      client.setex(`user:${address}:hodling`, 120, hodlingCount);
    }
    catch (e) {
      return null;
    }
  } else {
    console.log('getHodlingCount - cache hit - reading redis');
  }

  return hodlingCount;
}

route.get(async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const count = await getHodlingCount(address);
  res.status(200).json(count);
});


export default route;
