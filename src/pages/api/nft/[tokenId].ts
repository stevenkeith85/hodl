//
// This is used for getting a 'complete' NFT. i.e. what we've stored in Redis and the data from the blockchain.
// We use this for operations around ownership
//
// See also api/token, which is used to just get token data from our redis database

import NFT from '../../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json'
import Market from '../../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import { getProvider } from '../../../lib/server/connections'
import { ethers } from 'ethers'
import { NextApiRequest, NextApiResponse } from "next";
import dotenv from 'dotenv'
import apiRoute from '../handler';
import { getToken } from '../token/[tokenId]';
import { Nft } from '../../../models/Nft';

dotenv.config({ path: '../.env' })

const route = apiRoute();


// Does address/user 'own' the token.
export const isOwnerOrSeller = async (address, tokenId) => {
  try {
    const provider = await getProvider();

    const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, provider);
    const tokenExists = await tokenContract.exists(tokenId);

    if (!tokenExists) {
      return false;
    }

    const owner = await tokenContract.ownerOf(tokenId);

    if (address === owner) { // address owns token. (i.e. hodling it)
      return true;
    }

    const marketContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, provider);
    const marketItem = await marketContract.getListing(tokenId);

    if (address === marketItem.seller) { // address is the seller (i.e. listing it)
      return true;
    }

    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// Returns the address of the owner (if hodling) or the seller (if listed). 
// The owner is set to the market address when the token is listed, so we need to use the seller address in many places
export const getOwnerOrSellerAddress = async (tokenId) => {
  const provider = await getProvider();

  const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, provider);
  const tokenExists = await tokenContract.exists(tokenId);

  if (!tokenExists) {
    return false;
  }

  const owner = await tokenContract.ownerOf(tokenId);

  const marketContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, provider);
  const marketItem = await marketContract.getListing(tokenId);

  return isTokenForSale(marketItem) ? marketItem.seller : owner
}

const isTokenForSale = ({ price, seller, tokenId }) => {
  return price !== ethers.constants.Zero &&
    seller !== ethers.constants.AddressZero &&
    tokenId !== ethers.constants.Zero;
}

// The main function we call on the detail pages
// if the item is for sale, then we only consult Redis in O(1) and a blockchain call to 'getListed' (Market contract)
// it its not for sale, then we do Redis O(1), getListed (Market contract), and exists / ownerOf (Token contract)

// TODO: We read the blockchain here. 
// We could (in future) just read from cached data in Redis. (once we've implemented a robust caching strategy)
export const fetchNFT = async (id: number): Promise<Nft> => {
  const provider = await getProvider();

  const marketContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, provider);

  const marketItem = await marketContract.getListing(id);
  const forSale = isTokenForSale(marketItem);

  // Determine the token owner
  let owner = null;
  let price = '0';

  // if its for sale, technically the 'owner' will be the marketplace contract. 
  // We set it to the seller though; who is the 'actual owner'.
  if (forSale) {
    owner = marketItem.seller;
    price = ethers.utils.formatUnits(marketItem.price.toString(), 'ether');
  } else {
    try {
      // we'll have to consult the token contract to get the owner
      const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, provider);
      const tokenExists = await tokenContract.exists(id);

      if (!tokenExists) { // it was never minted on the blockchain. TODO: We could tell the user the token hasn't been minted
        throw new Error('token does not exist');
      }
      owner = await tokenContract.ownerOf(id);
    } catch (e) {
      throw new Error('Cannot talk to the blockchain at the moment');
    }
  }

  // Look up our immutable data from Redis
  const token = await getToken(id);

  if (!token) {
    // it's gone missing from our database! 
    // TODO: We could probably read the data from the blockchain here, and repopulate 
    // probably via a queue
    throw new Error('Error retrieving token'); 
  }

  const result: Nft = {
    price,
    owner,
    forSale,

    ...token
  }

  return result;
}

export const getTokenUriAndOwner = async (id) => {
  const provider = getProvider();
  const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, provider)

  // This is important! We only want to store HodlNFTs in our database at the moment. 
  // If a user tries to create spoof tokens and list on the market, we
  // won't show them on the website as we use the HodlNFT contract as the source of truth!
  const tokenUri = await tokenContract.tokenURI(id);
  const owner = await tokenContract.ownerOf(id);

  return { tokenUri, owner }
}

route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { tokenId } = req.query;

  if (!tokenId) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  try {
    const token = await fetchNFT(+tokenId);
    return res.status(200).json({ token })
  } catch (e) {
    return res.status(400).json({ message: 'Bad Request' });
  }
});

export default route;
