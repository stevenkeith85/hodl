import NFT from '../../../../../../smart-contracts/artifacts/contracts/HodlNFT.sol/HodlNFT.json'
import { getProvider } from '../../../../../lib/server/connections'

import { Contract } from '@ethersproject/contracts'

import { NextApiRequest, NextApiResponse } from "next";

import apiRoute from '../../../handler';

const route = apiRoute();

// This retrieves what we've got on the blockchain for our Hodl NFT
// To make it work with an ERC721, we need to pass in the contract address and check if that contract supports
// royalties before calling 'royaltyInfo'
export const getTokenFromBlockchain = async (id: number) => {
  const provider = await getProvider();

  const tokenContract = new Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, provider);
  const ownerOf = await tokenContract.ownerOf(id);

  // The royaltyFee is set in basis points
  // i.e. 100 is 1%, 1000 is 10%, 10000 is 100%
  // so we ask what the fee would be if the price was 10000 to get 
  // the royalty fee the user set for their nft in basis points, 
  const [creator, royalty] = await tokenContract.royaltyInfo(id, 10000)

  return {
    ownerOf,
    royaltyFeeInBasisPoints: royalty.toNumber()
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
