import dotenv from 'dotenv'
import { ethers } from 'ethers';
import { getProvider } from '../../../lib/server/connections';
import { nftmarketaddress } from '../../../../config';
import HodlMarket from '../../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import apiRoute from '../handler';
import { getToken } from '../token/[tokenId]';
import { Token } from '../../../models/Token';
import { Nft } from '../../../models/Nft';

dotenv.config({ path: '../.env' })

// The get hodling / get listed functionality should work fairly similar
// TODO: We may read more data from Redis in future if we can set up a decent blockchain/redis cache mechanism
const addressToListings = async (address, offset, limit) => {
    const provider = await getProvider();
    const market = new ethers.Contract(nftmarketaddress, HodlMarket.abi, provider);
    const result = await market.getListingsForAddress(address, offset, limit);
    return result;
}

export const getListed = async (address, offset, limit) => {
    try {
        const [listings, next, total] = await addressToListings(address, offset, limit);

        if (!listings.length) {
            return { items: [], next: 0, total: 0 };
        }

        const nfts: Nft [] = await Promise.all(listings.map(async listing => {
            const token: Token = await getToken(listing.tokenId);

            // If the token is present on the blockchain, 
            // but not in our database
            // we'll mark this as null.
            if (!token) {
                return null;
            }

            const nft: Nft = {
                ...token,
                owner: address,
                forSale: true,
                price: ethers.utils.formatEther(listing.price)
            }

            return nft;
        }));

        return { items: nfts, next: Number(next), total: Number(total) };
    } catch (e) {
        return { items: [], next: 0, total: 0 };
    }
}

const route = apiRoute();
route.get(async (req, res) => {
    const { address, offset, limit } = req.query;

    if (!address || !offset || !limit) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    const data = await getListed(address, offset, limit);
    return res.status(200).json(data);
});


export default route;
