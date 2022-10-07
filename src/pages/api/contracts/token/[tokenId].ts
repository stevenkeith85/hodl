import NFT from '../../../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json'
import Market from '../../../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import { getProvider } from '../../../../lib/server/connections'
import { ethers } from 'ethers'
import { NextApiRequest, NextApiResponse } from "next";
import dotenv from 'dotenv'
import apiRoute from '../../handler';
import { ListingSolidity } from '../../../../models/Listing';
import { Token, TokenSolidity } from '../../../../models/Token';

dotenv.config({ path: '../.env' })

const route = apiRoute();

// This retrieves what we've got on the blockchain
export const getToken = async (id: number): Promise<TokenSolidity> => {
  const provider = await getProvider();

  const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, provider);
  const ownerOf = await tokenContract.ownerOf(id);

  return {
    ownerOf
  };
}

route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { tokenId } = req.query;

  if (!tokenId) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  try {
    const token = await getToken(+tokenId);
    return res.status(200).json({ token })
  } catch (e) {
    return res.status(400).json({ message: 'Bad Request' });
  }
});

export default route;
