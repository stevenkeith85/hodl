import NFT from '../../artifacts/contracts/HodlNFT.sol/HodlNFT.json'
import Market from '../../artifacts/contracts/HodlMarket.sol/HodlMarket.json'

import { ipfsUriToCloudinaryUrl, ipfsUriToGatewayUrl } from '../utils';
import { getProvider } from './connections'
import { ethers } from 'ethers'
import { nftmarketaddress, nftaddress } from '../../config.js'

import { getToken } from '../../pages/api/token/[tokenId]';


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