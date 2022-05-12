import dotenv from 'dotenv'
import { ethers } from 'ethers';
import { getProvider } from '../../../lib/server/connections';

import { nftmarketaddress } from '../../../config';
import HodlMarket from '../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import { ipfsUriToCloudinaryUrl } from '../../../lib/utils';
import axios from 'axios';

import apiRoute from '../handler';

dotenv.config({ path: '../.env' })

export const getListed = async (address, offset, limit) => {
    try {
        const provider = await getProvider();
        const market = new ethers.Contract(nftmarketaddress, HodlMarket.abi, provider);
        let [data, next, total] = await market.getListingsForAddress(address, offset, limit);

        if (!data.length) {
            return {items: [], next: Number(next), total: Number(total)};
        }

        const tokenIdToListing = new Map();
        const tokenIds = [];

        for (const listing of data) {
            tokenIdToListing.set(Number(listing.tokenId), listing);
            tokenIds.push(listing.tokenId);
        }

        
        const tokens = await Promise.all(
            tokenIds.map(id => axios.get(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/token/${id}`).then(r => r.data.token))
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

        return {items, next: Number(next), total: Number(total)};
    } catch (e) {
        // console.log(e);
        return {items: [], next: 0, total: 0};
    }
}

const route = apiRoute();
route.get(async (req, res) => {
    const { address, offset, limit } = req.query;

    if (!address || !offset || !limit) {
        return res.status(400).json({message: 'Bad Request'});
    }

    const data = await getListed(address, offset, limit);
    return res.status(200).json(data);
});


export default route;
