import { ethers } from 'ethers'

import { nftmarketaddress } from '../config.js'
import Market from '../artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import { ipfsUriToCloudinaryUrl } from './utils';
import { getProvider } from './connections';


const getItems = async (data) => {
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
            seller: listing ? listing.seller : '',
            mimeType: token.mimeType
        };
    });

    return items;
}

export const fetchMarketItems = async (offset, limit) => {
    const provider = await getProvider();

    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
    const [data, next, total] = await marketContract.fetchMarketItems(offset, limit);

    if (!data.length) {
        return [[], 0, 0];
    }

    const items = await getItems(data);

    return [items, next, total];
}
