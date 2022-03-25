import { ethers } from 'ethers'

import { nftmarketaddress, nftaddress } from '../config.js'
import Market from '../artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import NFT from '../artifacts/contracts/HodlNFT.sol/HodlNFT.json'

import { ipfsUriToCloudinaryUrl } from './utils';
import { getProvider } from './connections';


export const isValidAddress = async address => await ethers.utils.isAddress(address);

const addressToTokenIds = async (address, offset, limit) => {
    const provider = await getProvider();
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const result = await tokenContract.addressToTokenIds(address, offset, limit);
    return result;
}

export const fetchNftsInWallet = async (address, offset, limit) => {
    console.log('adrress is', address)
    const [tokenIds, next, total] = await addressToTokenIds(address, offset, limit);

    if (!tokenIds.length) {
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

export const fetchNFTsListedOnMarket = async (address, offset, limit) => {
    const provider = await getProvider();
    const market = new ethers.Contract(nftmarketaddress, Market.abi, provider);
    const [data, next, total] = await market.getListingsForAddress(address, offset, limit);

    if (!data.length) {
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

    const items =  result.tokens.filter(token => token).map(token => {

        const listing = tokenIdToListing.get(Number(token.tokenId));

        return {
            tokenId: token.tokenId,
            name: token.name,
            description: token.description,
            image: ipfsUriToCloudinaryUrl(token.image),
            price: listing ? ethers.utils.formatUnits(listing.price, 'ether') : '',
            seller: listing ? listing.seller : ''
        };
    })

    return [items, next, total];
}
