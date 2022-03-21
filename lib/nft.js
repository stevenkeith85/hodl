import { BigNumber, ethers } from 'ethers'
import Web3Modal from "web3modal"
import memoize from 'memoizee';

import { nftmarketaddress, nftaddress } from '../config.js'

import Market from '../artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import NFT from '../artifacts/contracts/HodlNFT.sol/HodlNFT.json'


///////////////////////////////
// CLIENT-SIDE NFT FUNCTIONS //
///////////////////////////////


////////////
// WALLET //
////////////

export const getMetaMaskSigner = async () => {
  // A Web3Provider wraps a standard Web3 provider, which is
  // what MetaMask injects as window.ethereum into each page
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  // MetaMask requires requesting permission to connect users accounts
  await provider.send("eth_requestAccounts", []);

  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner()

  return signer;
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

export const mintToken = async (url) => {
  const signer = await getMetaMaskSigner();

  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer);

  // TODO: Check the IPFS Metadata URL IS CORRECT
  const createTokenTransaction = await tokenContract.createToken(url);

  const tx = await createTokenTransaction.wait();

  const event = tx.events[0];
  const value = event.args[2];
  const tokenId = value.toNumber();

  // clear the memoized value so that we can see the latest when we go to profile
  try {
    const walletAddress = await signer.getAddress();
    addressToTokenIds.clear(walletAddress);
  } catch(e) {
    // couldn't clear the cache
    console.log(e)
  }

  return tokenId;
}

///////////////////////////
// Detail / Listing Page //
///////////////////////////

const isTokenForSale = ({price, seller, tokenId}) => {
  return  price !== ethers.constants.Zero &&
          seller !== ethers.constants.AddressZero &&
          tokenId !== ethers.constants.Zero;
}

export const fetchMarketItem = async (tokenId) => {
  if (tokenId === undefined) {
    return false;
  }
  const provider = new ethers.providers.JsonRpcProvider("http://192.168.1.242:8545")

  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);

  const marketItem = await marketContract.getListing(tokenId);
  const owner = await tokenContract.ownerOf(tokenId);
  const tokenUri = await tokenContract.tokenURI(tokenId);

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
    owner: isTokenForSale(marketItem) ? marketItem.seller : owner,
    forSale: isTokenForSale(marketItem),
    image: ipfsUriToCloudinaryUrl(token.image),
    ipfsMetadata: tokenUri,
    ipfsMetadataGateway: ipfsUriToGatewayUrl(tokenUri),
    ipfsImage: token.image,
    ipfsImageGateway: ipfsUriToGatewayUrl(token.image),
  }
}

export const buyNft = async (nft) => {
  const signer = await getMetaMaskSigner();
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
  const transaction = await marketContract.buyToken(nftaddress, nft.tokenId, { value: price })

  await transaction.wait();

  // clear the memoized value so that we can see the latest when we go to profile
  try {
    const walletAddress = await signer.getAddress();
    addressToTokenIds.clear(walletAddress);
  } catch(e) {
    // couldn't clear the cache
    console.log(e)
  }
}

export const delistNft = async (nft) => {
  const signer = await getMetaMaskSigner();
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  const transaction = await marketContract.delistToken(nftaddress, nft.tokenId);

  await transaction.wait();

  // clear the memoized value so that we can see the latest when we go to profile
  try {
    const walletAddress = await signer.getAddress();
    addressToTokenIds.clear(walletAddress);
  } catch(e) {
    // couldn't clear the cache
    console.log(e)
  }
}


///////////////////
// Home / Market //
///////////////////

export const fetchMarketItems = async (offset, limit) => {
  const provider = new ethers.providers.JsonRpcProvider("http://192.168.1.242:8545")
  if (!provider ) {
    alert('no provider')
    return [[], 0, 0];
  }

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

const addressToTokenIds = memoize(async (address, offset, limit) => {
  const provider = new ethers.providers.JsonRpcProvider("http://192.168.1.242:8545")
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  const result =  await tokenContract.addressToTokenIds(address, offset, limit);

  return result;
})

export const fetchNftsInWallet = async (address, offset, limit) => {
  const [tokenIds, next, total] = await addressToTokenIds(address, Number(offset), Number(limit));

  if (!tokenIds.length ) {
    return [[], next, total];
  }

  // This call should be cached
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

export const isValidAddress = async (address) => {
  return await ethers.utils.isAddress(address);
}

export const fetchNFTsListedOnMarket = async (address) => {
  const provider = new ethers.providers.JsonRpcProvider("http://192.168.1.242:8545")
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);

  const data = await marketContract.getListingsForAddress(address);
  console.log('data is', data)

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

export const listTokenOnMarket = async (tokenId, tokenPrice) => {
  const signer = await getMetaMaskSigner();
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  const price = ethers.utils.parseUnits(tokenPrice, 'ether');
    
  const createMarketItemTransaction = await marketContract.listToken(nftaddress, tokenId, price);
  await createMarketItemTransaction.wait();

  // clear the memoized value so that we can see the latest when we go to profile
  try {
    const walletAddress = await signer.getAddress();
    addressToTokenIds.clear(walletAddress);
  } catch(e) {
    // couldn't clear the cache
    console.log(e)
  }
}
