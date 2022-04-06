import { ethers } from 'ethers'

import { nftmarketaddress, nftaddress } from '../config.js'
import Market from '../artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import NFT from '../artifacts/contracts/HodlNFT.sol/HodlNFT.json'

import { ipfsUriToCloudinaryUrl } from './utils';
import { getProvider } from './server/connections';

///////////////////////////////////////////////////////////////////////////
// TODO: Move to API function as we need to use the provider server side //
///////////////////////////////////////////////////////////////////////////

export const isValidAddress = async address => await ethers.utils.isAddress(address);

const addressToTokenIds = async (address, offset, limit) => {
    const provider = await getProvider();
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const result = await tokenContract.addressToTokenIds(address, offset, limit);
    return result;
}

export const fetchNftsInWallet = async (address, offset, limit) => {
    const [tokenIds, next, total] = await addressToTokenIds(address, offset, limit);

    if (!tokenIds.length) {
        return [[], next, total];
    }

    const tokens = await Promise.all(
        tokenIds.map(id => fetch(`/api/token/${id}`).then(r => r.json()).then(json => json.token))
    );

    const items = tokens.map(token => {

        // We want to keep the number of items in the array, 
        // so that it ties up with blockchain (and our infinite scroll iterator works), but 
        // won't show anything not in our database
        if (!token) {
            return null; 
        }

        return {        
            tokenId: token.tokenId,
            name: token.name,
            description: token.description,
            image: ipfsUriToCloudinaryUrl(token.image),
            mimeType: token.mimeType,
            filter: token.filter
    }
    });

    return [items, next, total];
}

export const fetchNFTsListedOnMarket = async (address, offset, limit) => {
    const provider = await getProvider();
    const market = new ethers.Contract(nftmarketaddress, Market.abi, provider);
    let [data, next, total] = await market.getListingsForAddress(address, offset, limit);

    if (!data.length) {
        return [[], next, total];
    }

    const tokenIdToListing = new Map();
    const tokenIds = [];

    for (const listing of data) {
        tokenIdToListing.set(Number(listing.tokenId), listing);
        tokenIds.push(listing.tokenId);
    }

    // We want to keep the number of items in the array, 
    // so that it ties up with blockchain (and our infinite scroll iterator works), but 
    // won't show anything not in our database
    const tokens = await Promise.all(
        tokenIds.map(id => fetch(`/api/token/${id}`).then(r => r.json()).then(json => json.token))
    );

    const items =  tokens.map(token => {

        if (!token) {
            return null; 
        }
        const listing = tokenIdToListing.get(Number(token.tokenId));

        return {
            tokenId: token.tokenId,
            name: token.name,
            description: token.description,
            image: ipfsUriToCloudinaryUrl(token.image),
            price: listing ? ethers.utils.formatUnits(listing.price, 'ether') : '',
            seller: listing ? listing.seller : '',
            mimeType: token.mimeType,
            filter: token.filter
        };
    })

    return [items, next, total];
}
