//
// This is used for getting a 'complete' NFT. i.e. what we've stored in Redis and the data from the blockchain.
// We use this for operations around ownership
//
// See also api/token, which is used to just get token data from our redis database

import NFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json'
import Market from '../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json'

import { ipfsUriToCid, ipfsUriToGatewayUrl } from '../../../lib/utils';
import { getProvider } from '../../../lib/server/connections'
import { ethers } from 'ethers'
import { nftmarketaddress, nftaddress } from '../../../config.js'

import { NextApiRequest, NextApiResponse } from "next";

import dotenv from 'dotenv'
import apiRoute from '../handler';
import { getToken } from '../token/[tokenId]';
import { Nft } from '../../../models/Nft';

dotenv.config({ path: '../.env' })

const route = apiRoute();


// Does address/user 'own' the token.
export const isOwnerOrSeller = async (address, tokenId) => {
  const provider = await getProvider();

  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  const tokenExists = await tokenContract.exists(tokenId);

  if (!tokenExists) {
    return false;
  }

  const owner = await tokenContract.ownerOf(tokenId);

  if (address === owner) { // address owns token. (i.e. hodling it)
    return true;
  }

  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
  const marketItem = await marketContract.getListing(tokenId);

  if (address === marketItem.seller) { // address is the seller (i.e. listing it)
    return true;
  }

  return false;
}

// Returns the address of the owner (if hodling) or the seller (if listed). 
// The owner is set to the market address when the token is listed, so we need to use the seller address in many places
export const getOwnerOrSellerAddress = async (tokenId) => {
  const provider = await getProvider();

  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  const tokenExists = await tokenContract.exists(tokenId);

  if (!tokenExists) {
    return false;
  }

  const owner = await tokenContract.ownerOf(tokenId);

  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
  const marketItem = await marketContract.getListing(tokenId);

  return isTokenForSale(marketItem) ? marketItem.seller : owner
}

const isTokenForSale = ({ price, seller, tokenId }) => {
  return price !== ethers.constants.Zero &&
    seller !== ethers.constants.AddressZero &&
    tokenId !== ethers.constants.Zero;
}

export const fetchNFT = async (id: number): Promise<Nft> => {
  const provider = await getProvider();

  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);

  const tokenExists = await tokenContract.exists(id);

  if (!tokenExists) {
    throw new Error('token does not exist');
  }

  const marketItem = await marketContract.getListing(id);
  const owner = await tokenContract.ownerOf(id);
  const tokenUri = await tokenContract.tokenURI(id);

  const token = await getToken(id);

  if (!token) {
    throw new Error('could not get token');
  }

  const price = ethers.utils.formatUnits(marketItem.price.toString(), 'ether');

  const result: Nft = {
    id: token.id,
    name: token.name,
    description: token.description,
    privilege: token.privilege || null,
    image: ipfsUriToCid(token.image),
    mimeType: token.mimeType || '',
    filter: token.filter || null,

    price,
    owner: isTokenForSale(marketItem) ? marketItem.seller : owner,
    forSale: isTokenForSale(marketItem),
    
    // TODO - Clean all this up. we probably should just store content ids and construct things off that
    ipfsMetadata: tokenUri,
    ipfsMetadataGateway: ipfsUriToGatewayUrl(tokenUri),
    ipfsImage: token.image,
    ipfsImageGateway: ipfsUriToGatewayUrl(token.image),
    
  }

  return result;
}

export const getTokenUriAndOwner = async (id) => {
  const provider = getProvider();
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)

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
