import dotenv from 'dotenv'
import { ipfsUriToCloudinaryUrl } from '../../../lib/utils';
import apiRoute from '../handler';
import { getToken } from '../token/[tokenId]';
import { Redis } from '@upstash/redis';
import { ethers } from 'ethers';
import { nftaddress, nftmarketaddress } from '../../../config';
import { getProvider } from '../../../lib/server/connections';
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import HodlMarket from '../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json'

const client = Redis.fromEnv()

dotenv.config({ path: '../.env' })

const isTokenForSale = ({ price, seller, tokenId }) => {
    return price !== ethers.constants.Zero &&
      seller !== ethers.constants.AddressZero &&
      tokenId !== ethers.constants.Zero;
  }

const getItems = async (tokenIds) => {
    const provider = await getProvider();
    const tokenContract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
    const marketContract = new ethers.Contract(nftmarketaddress, HodlMarket.abi, provider);
    

    const tokens = await Promise.all(
        tokenIds.map(id => getToken(id))
    );

    const items = Promise.all(tokens.filter(token => token).map(async token => {
        const listing = await marketContract.getListing(token.tokenId);
        const owner = await tokenContract.ownerOf(token.tokenId);

        return {
            tokenId: token.tokenId,
            name: token.name,
            seller: listing.seller !== ethers.constants.AddressZero ? listing.seller : null,
            forSale: isTokenForSale(listing),
            price:  isTokenForSale(listing) ? ethers.utils.formatUnits(listing.price.toString(), 'ether') : null,
            owner,
            image: ipfsUriToCloudinaryUrl(token.image),
            mimeType: token.mimeType || null,
            filter: token.filter || null
        };
    }));

    return items;
}


export const getSearchResults = async (q, offset, limit) => {
    try {
        const tag = q;
        const tokenIds = await client.zrange(`tag:${tag}`, offset, offset + limit - 1);
        const total = await client.zcount(`tag:${tag}`, '-inf', '+inf');

        const items = await getItems(tokenIds);

        return { items, next: Number(offset) + Number(tokenIds.length), total: Number(total) };
    } catch (e) {
        return { items: [], next: 0, total: 0 };
    }
}


const route = apiRoute();
route.get(async (req, res) => {
    const { q, offset, limit } = req.query;

    if (!q || !offset || !limit) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    const data = await getSearchResults(q, offset, limit);
    return res.status(200).json(data);
});


export default route;
