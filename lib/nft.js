import { ethers } from 'ethers'
import Web3Modal from "web3modal"

import { nftmarketaddress, nftaddress } from '../config.js'

import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import mime from 'mime';


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
  const [protocol, uri] = ipfsUri.split('//');
  const [cid, path] = uri.split('/');
  
  if (path) {
    return `https://${cid}.ipfs.infura-ipfs.io/${path}`;
  }
  
  return `https://${cid}.ipfs.infura-ipfs.io`;
  
}

export const ipfsUriToCloudinaryUrl = ipfsUri => {
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
    return {}
  }
  const provider = new ethers.providers.JsonRpcProvider()

  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
  const marketItem = await marketContract.getListing(tokenId);
  if (marketItem.tokenId === 0) { // The listing doesn't have a token
    return false;
  }

  const r = await fetch(`/api/token/${tokenId}`);
  const token = await r.json();
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

  const items = await Promise.all(data.map(async i => {
    const r = await fetch(`/api/token/${i.tokenId}`);
    const token = await r.json();

    const price = ethers.utils.formatUnits(i.price.toString(), 'ether');

    return {
      name: token.name,
      description: token.description,
      price,
      tokenId: i.tokenId.toNumber(),
      seller: i.seller,
      owner: i.owner,
      image: ipfsUriToCloudinaryUrl(token.image),
    }
  }))

  return [items, next, total];
}


/////////////
// Profile //
/////////////

export const fetchNftsInWallet = async (address) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  const tokenIds = await tokenContract.getTokensForAddress(address);
  console.log('tokenIds', tokenIds)

  const items = await Promise.all(tokenIds.map(async tokenId => {
    const r = await fetch(`/api/token/${tokenId}`);
    const token = await r.json();

    return {
      name: token.name,
      description: token.description,
      tokenId: tokenId.toNumber(),
      image: ipfsUriToCloudinaryUrl(token.image),
    }
  }));

  return items;
}

export const fetchNFTsListedOnMarket = async (address) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);

  const data = await marketContract.getListingsForAddress(address);
  console.log('data', data)

  const items = await Promise.all(data.map(async i => {
    const r = await fetch(`/api/token/${i.tokenId}`);
    const token = await r.json();
    let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

    return {
      name: token.name,
      description: token.description,
      price,
      tokenId: i.tokenId.toNumber(),
      seller: i.seller,
      owner: i.owner,
      image: ipfsUriToCloudinaryUrl(token.image),
    }
  }));

  return items;
}


/////////////////
// Detail Page //
/////////////////

export const fetchToken = async (tokenId, { provider, signer }) => {
  const [marketContarct, tokenContract] = await getContracts(provider, signer);

  const tokenUri = await tokenContract.tokenURI(tokenId);
  const owner = await tokenContract.ownerOf(tokenId);

  const r = await fetch(`/api/token/${tokenId}`);
  const token = await r.json();

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
