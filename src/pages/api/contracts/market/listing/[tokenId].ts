import NFT from '../../../../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json'
import Market from '../../../../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import { getProvider } from '../../../../../lib/server/connections'
import { ethers } from 'ethers'
import { NextApiRequest, NextApiResponse } from "next";
import dotenv from 'dotenv'
import apiRoute from '../../../handler';
import { ListingSolidity, ListingVM } from '../../../../../models/Listing';

dotenv.config({ path: '../.env' })
const route = apiRoute();

const isValidListing = ({ seller, tokenId }: ListingSolidity) => {
  return seller !== ethers.constants.AddressZero && tokenId !== ethers.constants.Zero;
}

// This retrieves what we've got on the blockchain
export const getListing = async (id: number): Promise<ListingVM> => {
  const provider = await getProvider();

  const marketContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, provider);
  const listing: ListingSolidity = await marketContract.getListing(id);

  if (isValidListing(listing)) {
    return {
      price: listing.price.toNumber(),
      seller: listing.seller,
      tokenId: listing.tokenId.toNumber()
    };
  }

  return null;
}

route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { tokenId } = req.query;

  if (!tokenId) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  try {
    const listing: ListingVM = await getListing(+tokenId);
    return res.status(200).json({ listing })
  } catch (e) {
    return res.status(400).json({ message: 'Bad Request' });
  }
});

export default route;
