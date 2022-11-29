import NFT from '../../../../../../smart-contracts/artifacts/contracts/HodlNFT.sol/HodlNFT.json'
import { getProvider } from '../../../../../lib/server/connections'

import { Contract } from '@ethersproject/contracts'

import { NextApiRequest, NextApiResponse } from "next";

import apiRoute from '../../../handler';
import { TokenSolidity } from "../../../../../models/TokenSolidity";


const route = apiRoute();

// This retrieves what we've got on the blockchain
export const getTokenFromBlockchain = async (id: number): Promise<TokenSolidity> => {
  const provider = await getProvider();

  const tokenContract = new Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, provider);
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
    const token = await getTokenFromBlockchain(+tokenId);
    return res.status(200).json({ token })
  } catch (e) {
    return res.status(400).json({ message: 'Bad Request' });
  }
});

export default route;
