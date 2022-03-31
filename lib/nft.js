import { ethers, BigNumber } from 'ethers'

import { nftmarketaddress, nftaddress } from '../config.js'
import Market from '../artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import NFT from '../artifacts/contracts/HodlNFT.sol/HodlNFT.json'

import { ipfsUriToCloudinaryUrl, ipfsUriToGatewayUrl } from './utils';
import { getProvider } from './connections';
import { getMetaMaskSigner } from "../lib/connections";

const isTokenForSale = ({ price, seller, tokenId }) => {
  return price !== ethers.constants.Zero &&
    seller !== ethers.constants.AddressZero &&
    tokenId !== ethers.constants.Zero;
}


export const fetchMarketItem = async tokenId => {
  const provider = await getProvider();

  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);

  const marketItem = await marketContract.getListing(tokenId);
  const owner = await tokenContract.ownerOf(tokenId);
  const tokenUri = await tokenContract.tokenURI(tokenId);

  const r = await fetch(`/api/token/${tokenId}`);
  const json = await r.json();
  const token = json.tokens[0]

  console.log('token', token)
  if (!token) {
    return false;
  }

  const price = ethers.utils.formatUnits(marketItem.price.toString(), 'ether');

  return {
    name: token.name,
    description: token.description,
    price,
    tokenId: token.tokenId,
    owner: isTokenForSale(marketItem) ? marketItem.seller : owner,
    forSale: isTokenForSale(marketItem),
    image: ipfsUriToCloudinaryUrl(token.image),
    ipfsMetadata: tokenUri,
    ipfsMetadataGateway: ipfsUriToGatewayUrl(tokenUri),
    ipfsImage: token.image,
    ipfsImageGateway: ipfsUriToGatewayUrl(token.image),
    mimeType: token.mimeType
  }
}

export const lookupPriceHistory = async tokenId => {
  const provider = await getProvider();

  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);

  const tokenFilter = marketContract.filters.TokenBought(null, null, BigNumber.from(tokenId))

  const txs = await marketContract.queryFilter(tokenFilter, 0, "latest");
  

  const result = [];
   for (let tx of txs) {
   const block = await tx.getBlock();

     result.push({
      seller: tx.args.seller, 
      buyer: tx.args.buyer, 
      price: ethers.utils.formatEther(tx.args.price),
      timestamp: block.timestamp
    })
  
  }

  return result.reverse(); // we want the newest first for the UI 
}


export const buyNft = async (nft) => {
  const signer = await getMetaMaskSigner();
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
  const transaction = await marketContract.buyToken(nftaddress, nft.tokenId, { value: price })

  await transaction.wait();
}

export const listTokenOnMarket = async (tokenId, tokenPrice) => {
  const signer = await getMetaMaskSigner();
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  const price = ethers.utils.parseUnits(tokenPrice, 'ether');

  const createMarketItemTransaction = await marketContract.listToken(nftaddress, tokenId, price);
  await createMarketItemTransaction.wait();
}

export const delistNft = async (nft) => {
  const signer = await getMetaMaskSigner();
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  const transaction = await marketContract.delistToken(nftaddress, nft.tokenId);

  await transaction.wait();
}
