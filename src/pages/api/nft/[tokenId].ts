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
import { Nft } from '../../../models/Nft';
import { ListingSolidity } from '../../../models/Listing';
import { Redis } from '@upstash/redis';
import { Token } from '../../../models/Token';
import { getListing } from '../contracts/market/listing/[tokenId]';
import { getToken } from '../contracts/token/[tokenId]';

dotenv.config({ path: '../.env' })

const route = apiRoute();
const client = Redis.fromEnv()

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

export const getHodlerAddress = async (tokenId) => {
  const listing = await getListing(tokenId);

  if (listing) {
    return listing.seller;
  }

  const token = await getToken(tokenId);
  return token.ownerOf;
}

const isTokenForSale = ({ price, seller, tokenId }: ListingSolidity) => {
  return seller !== ethers.constants.AddressZero &&
    tokenId !== ethers.constants.Zero;
}

// Reading the block chain here takes about 1.5 seconds :(
// We'll need to cache the price, owner, and for sale status in redis

// TODO: Read the record from redis, which will include the owner, price, and forSale status.
// and spin off a message queue task to get the latest data from the blockchain to keep the record in-sync
// potentially push the updated data to the UI aswell...
//
// Or potentially, we could first have separate endpoints to get the token owner, and {forSale/price} status.
// it would let the page load faster, and we could use SWR
export const fetchNFT = async (id: number): Promise<Nft> => {
  // const start = new Date();
  console.log('api/nft - retrieving token with id', id);
  const tokenPromise: Promise<Token> = client.get<Token>('token:' + id);

  // And get the block-chain data too
  const provider = await getProvider();
  const marketContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, provider);
  const listing: ListingSolidity = await marketContract.getListing(id);
  const forSale = isTokenForSale(listing);

  // Determine the token owner
  let owner = null;
  let price = '0';

  // We cannot simply do an 'ownerOf' if the token is listed; as this will return the market contract's address
  if (forSale) {
    owner = listing.seller;
    price = ethers.utils.formatUnits(listing.price.toString(), 'ether');
  } else {
    try {
      const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, NFT.abi, provider);
      owner = await tokenContract.ownerOf(id);
    } catch (e) {
      throw new Error('Cannot talk to the blockchain at the moment');
    }
  }

  const [token] = await Promise.all([tokenPromise]);

  

  if (!token) {
    console.log('api/nft cannot retrieve token')
    throw new Error('Error retrieving token');
  }

  console.log('api/nft retrieved token', token);

  const result: Nft = {
    price,
    owner,
    forSale,

    ...token
  }
  // const stop = new Date();
  // console.log('time taken', stop - start);
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
