//
// This is used for getting a 'complete' NFT. i.e. what we've stored in Redis and the data from the blockchain.
// We use this for operations around ownership
//

import NFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json'
import Market from '../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json'

import { ipfsUriToCloudinaryUrl, ipfsUriToGatewayUrl } from '../../../lib/utils';
import { getProvider } from '../../../lib/server/connections'
import { ethers } from 'ethers'
import { nftmarketaddress, nftaddress } from '../../../config.js'

import { NextApiRequest, NextApiResponse } from "next";

import dotenv from 'dotenv'
import apiRoute from '../handler';
import { getToken } from '../token/[tokenId]';

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


export const fetchNFT = async tokenId => {
  const provider = await getProvider();

  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  const tokenExists = await tokenContract.exists(tokenId);

  if (!tokenExists) {
    return false;
  }

  const marketItem = await marketContract.getListing(tokenId);
  const owner = await tokenContract.ownerOf(tokenId);
  const tokenUri = await tokenContract.tokenURI(tokenId);

  const token = await getToken(tokenId);

  if (!token) {
    return false;
  }

  const price = ethers.utils.formatUnits(marketItem.price.toString(), 'ether');

  return {
    name: token.name,
    description: token.description,
    privilege: token.privilege || null,
    price,
    tokenId: token.tokenId,
    owner: isTokenForSale(marketItem) ? marketItem.seller : owner,
    forSale: isTokenForSale(marketItem),
    image: ipfsUriToCloudinaryUrl(token.image),
    ipfsMetadata: tokenUri,
    ipfsMetadataGateway: ipfsUriToGatewayUrl(tokenUri),
    ipfsImage: token.image,
    ipfsImageGateway: ipfsUriToGatewayUrl(token.image),
    mimeType: token.mimeType || '',
    filter: token.filter || null
  }
}

export const getTokenUriAndOwner = async (tokenId) => {
  const provider = getProvider();
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)

  // This is important! We only want to store HodlNFTs in our database at the moment. 
  // If a user tries to create spoof tokens and list on the market, we
  // won't show them on the website as we use the HodlNFT contract as the source of truth!
  const tokenUri = await tokenContract.tokenURI(tokenId);
  const owner = await tokenContract.ownerOf(tokenId);

  return { tokenUri, owner }
}

route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { tokenId } = req.query;

  if (!tokenId) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const token = await fetchNFT(tokenId);
  res.status(200).json({ token })
});

export default route;
