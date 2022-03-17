import { ethers } from 'ethers'
import Web3Modal from "web3modal"

import { nftmarketaddress, nftaddress } from '../config.js'

import Market from '../artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import NFT from '../artifacts/contracts/HodlNFT.sol/HodlNFT.json'


///////////////////////////////
// CLIENT-SIDE NFT FUNCTIONS //
///////////////////////////////


////////////////////////
// WALLET / CONTRACTS //
////////////////////////
export const getProviderAndSigner = async () => {
  const web3Modal = new Web3Modal({
    cacheProvider: false,
    disableInjectedProvider: false,
    providerOptions: {
    },
  });
  await web3Modal.clearCachedProvider();
  const provider = await web3Modal.connect();

  const ethersProvider = new ethers.providers.Web3Provider(provider);
  const signer = ethersProvider.getSigner();

  console.log('{provider, signer}', { provider, signer });
  return { provider, signer };
}

export const getContracts = async (provider, signer) => {
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer);

  return [marketContract, tokenContract];
}


///////////
// Utils //
///////////

export const ipfsUriToGatewayUrl = (ipfsUri) => {
  if (!ipfsUri) {
    return '#';
  }

  const [protocol, uri] = ipfsUri.split('//');
  const [cid, path] = uri.split('/');

  if (path) {
    return `https://${cid}.ipfs.infura-ipfs.io/${path}`;
  }

  return `https://${cid}.ipfs.infura-ipfs.io`;

}

export const ipfsUriToCloudinaryUrl = ipfsUri => {
  if (!ipfsUri) {
    return '#';
  }

  const [protocol, uri] = ipfsUri.split('//');
  const [cid, path] = uri.split('/');
  return `${cid}.jpg`
}


/////////////
// Minting //
/////////////

export const mintToken = async (url, { provider, signer }) => {
  const [marketContract, tokenContract] = await getContracts(provider, signer);

  // TODO: Check the IPFS Metadata URL IS CORRECT
  const createTokenTransaction = await tokenContract.createToken(url);

  const tx = await createTokenTransaction.wait();
  const event = tx.events[0];
  const value = event.args[2];
  const tokenId = value.toNumber();
  return tokenId;
}

//////////////////
// Listing Page //
//////////////////

export const fetchMarketItem = async (tokenId) => {
  if (tokenId === undefined) {
    return false;
  }
  const provider = new ethers.providers.JsonRpcProvider()

  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
  const marketItem = await marketContract.getListing(tokenId);

  const r = await fetch(`/api/token/${tokenId}`);
  const json = await r.json();
  const token = json.tokens[0]

  if (!token) {
    return false;
  }

  const price = ethers.utils.formatUnits(marketItem.price.toString(), 'ether');

  return {
    name: token.name,
    description: token.description,
    price,
    tokenId: marketItem.tokenId.toNumber(),
    seller: marketItem.seller,
    owner: marketItem.owner,
    forSale: marketItem.forSale,
    image: ipfsUriToCloudinaryUrl(token.image),
  }
}

export const buyNft = async (nft, { provider, signer }) => {
  const [marketContract] = await getContracts(provider, signer);

  const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
  const transaction = await marketContract.buyToken(nftaddress, nft.tokenId, { value: price })

  await transaction.wait();
}

export const delistNft = async (nft, { provider, signer }) => {
  const [marketContract] = await getContracts(provider, signer);
  const transaction = await marketContract.delistToken(nftaddress, nft.tokenId);

  await transaction.wait();
}


///////////////////
// Home / Market //
///////////////////

export const fetchMarketItems = async (offset, limit) => {
  const provider = new ethers.providers.JsonRpcProvider()

  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
  const [data, next, total] = await marketContract.fetchMarketItems(offset, limit)

  if (!data.length ) {
    return [[], 0, 0];
  }

  const tokenIdToListing = new Map();
  const tokenIds = [];

  for (const listing of data) {
    tokenIdToListing.set(Number(listing.tokenId), listing);
    tokenIds.push(listing.tokenId);
  }

  const r = await fetch(`/api/token/${tokenIds.join('/')}`);
  const result = await r.json();

  const items = result.tokens.filter(token => token).map(token => {

    const listing = tokenIdToListing.get(Number(token.tokenId));

    return {
      tokenId: token.tokenId,
      name: token.name,
      description: token.description,
      image: ipfsUriToCloudinaryUrl(token.image),

      price: listing ? ethers.utils.formatUnits(listing.price.toString(), 'ether') : '',
      seller: listing ? listing.seller: ''
    };
  })

  return [items, next, total];
}


/////////////
// Profile //
/////////////

export const fetchNftsInWallet = async (address, offset, limit) => {
  console.log('HEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRRRRREEEEEEEEEEEEEE')
  const provider = new ethers.providers.JsonRpcProvider();
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  const [tokenIds, next, total] = await tokenContract.addressToTokenIds(address, offset, limit);

  

  if (!tokenIds.length ) {
    return [[], next, total];
  }

  const r = await fetch(`/api/token/${tokenIds.join('/')}`);
  const result = await r.json();

  const items = result.tokens.filter(token => token).map(token => ({
        tokenId: token.tokenId,
        name: token.name,
        description: token.description,
        image: ipfsUriToCloudinaryUrl(token.image)
  }));

  return [items, next, total];
}


export const fetchNFTsListedOnMarket = async (address) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);

  const data = await marketContract.getListingsForAddress(address);
  console.log('data', data)

  if (!data.length ) {
    return [];
  }

  const tokenIdToListing = new Map();
  const tokenIds = [];

  for (const listing of data) {
    tokenIdToListing.set(Number(listing.tokenId), listing);
    tokenIds.push(listing.tokenId);
  }

  const r = await fetch(`/api/token/${tokenIds.join('/')}`);
  const result = await r.json();

  return result.tokens.filter(token => token).map(token => {

    const listing = tokenIdToListing.get(Number(token.tokenId));

    return {
      tokenId: token.tokenId,
      name: token.name,
      description: token.description,
      image: ipfsUriToCloudinaryUrl(token.image),

      price: listing ? ethers.utils.formatUnits(listing.price, 'ether') : '',
      seller: listing ? listing.seller: ''
    };
  })
}


/////////////////
// Detail Page //
/////////////////

export const fetchToken = async (tokenId, { provider, signer }) => {
  const [marketContarct, tokenContract] = await getContracts(provider, signer);

  const tokenUri = await tokenContract.tokenURI(tokenId);
  const owner = await tokenContract.ownerOf(tokenId);

  const r = await fetch(`/api/token/${tokenId}`);
  const json = await r.json();
  const token = json.tokens[0]

  if (!token) {
    return false;
  }

  return {
    name: token.name,
    description: token.description,
    tokenId,
    owner,
    ipfsMetadata: tokenUri,
    ipfsMetadataGateway: ipfsUriToGatewayUrl(tokenUri),
    ipfsImage: token.image,
    ipfsImageGateway: ipfsUriToGatewayUrl(token.image),
    image: ipfsUriToCloudinaryUrl(token.image),
  };
}

export const listTokenOnMarket = async (tokenId, tokenPrice, { provider, signer }) => {
  const [marketContract, tokenContract] = await getContracts(provider, signer);
  const price = ethers.utils.parseUnits(tokenPrice, 'ether');

  let listingPrice = await marketContract.getMinListingPriceInMatic();
  listingPrice = listingPrice.toString();

  const createMarketItemTransaction = await marketContract.listToken(nftaddress, tokenId, price);
  await createMarketItemTransaction.wait();
}
