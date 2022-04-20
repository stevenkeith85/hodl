// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dotenv from 'dotenv'
import { ethers } from 'ethers';
import { getProvider } from '../../../lib/server/connections';

import { nftmarketaddress } from '../../../config';
import HodlMarket from '../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import { ipfsUriToCloudinaryUrl } from '../../../lib/utils';

import apiRoute from '../handler';

dotenv.config({ path: '../.env' })


const getItems = async (data) => {
    const tokenIdToListing = new Map();
    const tokenIds = [];

    for (const listing of data) {
        tokenIdToListing.set(Number(listing.tokenId), listing);
        tokenIds.push(listing.tokenId);
    }

    const tokens = await Promise.all(
        tokenIds.map(id => fetch(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/token/${id}`).then(r => r.json()).then(json => json.token))
    );

    const items = tokens.filter(token => token).map(token => {
        const listing = tokenIdToListing.get(Number(token.tokenId));

        return {
            tokenId: token.tokenId,
            name: token.name,
            description: token.description,
            image: ipfsUriToCloudinaryUrl(token.image),

            price: listing ? ethers.utils.formatUnits(listing.price.toString(), 'ether') : '',
            seller: listing ? listing.seller : '',
            mimeType: token.mimeType,
            filter: token.filter
        };
    });

    return items;
}


export const fetchMarketItems = async (offset, limit) => {
    try {
        const provider = await getProvider();

        const contract = new ethers.Contract(nftmarketaddress, HodlMarket.abi, provider);
        const [data, next, total] = await contract.fetchMarketItems(offset, limit);

        if (!data.length) {
            return { items: [], next: 0, total: 0 };
        }

        const items = await getItems(data);

        return { items, next: Number(next), total: Number(total) };
    } catch (e) {
        return { items: [], next: 0, total: 0 };
    }
}

const route = apiRoute();
route.get(async (req, res) => {
    const { offset, limit } = req.query;

    if (!offset || !limit) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    const data = await fetchMarketItems(offset, limit);
    return res.status(200).json({ data });
});


export default route;
