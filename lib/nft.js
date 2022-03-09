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
  const cid = ipfsUri.split('ipfs://')[1]
  return `https://${cid}.ipfs.infura-ipfs.io`;
}

export const ipfsUriToLocalUrl = async (ipfsUri) => {
  const gatewayUrl = ipfsUriToGatewayUrl(ipfsUri);
  const response = await fetch(gatewayUrl);
  const ext = mime.getExtension(response.headers.get('Content-Type'));
  const cid = ipfsUri.split('ipfs://')[1];
  return `/hashed/${cid}.${ext}`;
}


/////////////
// Minting //
/////////////

export const mintToken = async (url, { provider, signer }) => {
  const [marketContract, tokenContract] = await getContracts(provider, signer);

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

export const fetchMarketItem = async (itemId) => {
  if (itemId === undefined) {
    return {}
  }
  const provider = new ethers.providers.JsonRpcProvider()

  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
  const marketItem = await marketContract.fetchMarketItem(itemId)

  const tokenContract = new ethers.Contract(marketItem.nftContract, NFT.abi, provider)
  const tokenUri = await tokenContract.tokenURI(marketItem.tokenId);
  const response = await fetch(ipfsUriToGatewayUrl(tokenUri));

  const meta = await response.json();
  const price = ethers.utils.formatUnits(marketItem.price.toString(), 'ether');

  return {
    name: meta.name,
    description: meta.description,
    price,
    tokenId: marketItem.tokenId.toNumber(),
    seller: marketItem.seller,
    owner: marketItem.owner,
    forSale: marketItem.forSale,
    image: await ipfsUriToLocalUrl(meta.image),
  }
}

export const buyNft = async (nft, { provider, signer }) => {
  const [marketContract, tokenContract] = await getContracts(provider, signer);

  const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
  const transaction = await marketContract.createMarketSale(nftaddress, nft.tokenId, { value: price })

  await transaction.wait();
}

export const delistNft = async (nft, { provider, signer }) => {
  const [marketContract, tokenContract] = await getContracts(provider, signer);
  const transaction = await marketContract.delistToken(nftaddress, nft.tokenId);

  await transaction.wait();
}


///////////////////
// Home / Market //
///////////////////

export const fetchMarketItems = async () => {
  const provider = new ethers.providers.JsonRpcProvider()

  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
  const data = await marketContract.fetchMarketItems()

  const items = await Promise.all(data.map(async i => {
    const tokenUri = await tokenContract.tokenURI(i.tokenId);
    const response = await fetch(ipfsUriToGatewayUrl(tokenUri))

    const meta = await response.json();
    const price = ethers.utils.formatUnits(i.price.toString(), 'ether');

    return {
      name: meta.name,
      description: meta.description,
      price,
      tokenId: i.tokenId.toNumber(),
      seller: i.seller,
      owner: i.owner,
      image: await ipfsUriToLocalUrl(meta.image),
    }
  }))

  return items;
}


/////////////
// Profile //
/////////////

export const fetchMyNFTsListedOnMarket = async ({ provider, signer }) => {
  const [marketContract, tokenContract] = await getContracts(provider, signer);
  const data = await marketContract.fetchMyNFTs();

  const items = await Promise.all(data.map(async i => {
    const tokenUri = await tokenContract.tokenURI(i.tokenId);
    const response = await fetch(ipfsUriToGatewayUrl(tokenUri));
    const meta = await response.json();

    let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

    return {
      name: meta.name,
      description: meta.description,
      price,
      tokenId: i.tokenId.toNumber(),
      seller: i.seller,
      owner: i.owner,
      image: await ipfsUriToLocalUrl(meta.image),
    }
  }));

  return items;
}

export const fetchMyNftsInWallet = async ({ provider, signer }) => {
  const [_marketContract, tokenContract] = await getContracts(provider, signer);
  const address = await signer.getAddress();
  const tokenIds = await tokenContract.getTokensForAddress(address);

  const items = await Promise.all(tokenIds.map(async tokenId => {
    const tokenUri = await tokenContract.tokenURI(tokenId);
    const response = await fetch(ipfsUriToGatewayUrl(tokenUri));
    const meta = await response.json();

    return {
      name: meta.name,
      description: meta.description,
      tokenId: tokenId.toNumber(),
      ipfsMetadata: tokenUri,
      ipfsMetadataGateway: ipfsUriToGatewayUrl(tokenUri),
      ipfsImage: meta.image,
      ipfsImageGateway: ipfsUriToGatewayUrl(meta.image),
      image: await ipfsUriToLocalUrl(meta.image),
    }
  }));

  return items;
}

export const fetchNftsInWallet = async (address) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  const tokenIds = await tokenContract.getTokensForAddress(address);

  const items = await Promise.all(tokenIds.map(async tokenId => {
    const tokenUri = await tokenContract.tokenURI(tokenId);
    const response = await fetch(ipfsUriToGatewayUrl(tokenUri));
    const meta = await response.json();

    return {
      name: meta.name,
      description: meta.description,
      tokenId: tokenId.toNumber(),
      ipfsMetadata: tokenUri,
      ipfsMetadataGateway: ipfsUriToGatewayUrl(tokenUri),
      ipfsImage: meta.image,
      ipfsImageGateway: ipfsUriToGatewayUrl(meta.image),
      image: await ipfsUriToLocalUrl(meta.image),
    }
  }));

  return items;
}

export const fetchNFTsListedOnMarket = async (address) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);

  const data = await marketContract.getListingsForAddress(address);

  const items = await Promise.all(data.map(async i => {
    const tokenUri = await tokenContract.tokenURI(i.tokenId);
    const response = await fetch(ipfsUriToGatewayUrl(tokenUri));
    const meta = await response.json();

    let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

    return {
      name: meta.name,
      description: meta.description,
      price,
      tokenId: i.tokenId.toNumber(),
      seller: i.seller,
      owner: i.owner,
      image: await ipfsUriToLocalUrl(meta.image),
    }
  }));

  return items;
}


/////////////////
// Detail Page //
/////////////////

export const fetchToken = async (tokenId, { provider, signer }) => {
  const [marketContract, tokenContract] = await getContracts(provider, signer);

  console.log(provider, signer, tokenId);
  const tokenUri = await tokenContract.tokenURI(tokenId);
  console.log(tokenUri)
  const owner = await tokenContract.ownerOf(tokenId);

  const response = await fetch(ipfsUriToGatewayUrl(tokenUri));
  const meta = await response.json();

  return {
    name: meta.name,
    description: meta.description,
    tokenId,
    owner,
    ipfsMetadata: tokenUri,
    ipfsMetadataGateway: ipfsUriToGatewayUrl(tokenUri),
    ipfsImage: meta.image,
    ipfsImageGateway: ipfsUriToGatewayUrl(meta.image),
    image: await ipfsUriToLocalUrl(meta.image),
  };
}

export const listTokenOnMarket = async (tokenId, tokenPrice, { provider, signer }) => {
  const [marketContract, tokenContract] = await getContracts(provider, signer);
  const price = ethers.utils.parseUnits(tokenPrice, 'ether');

  let listingPrice = await marketContract.getListingPrice();
  listingPrice = listingPrice.toString();

  const createMarketItemTransaction = await marketContract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice });
  await createMarketItemTransaction.wait();
}
