import dotenv from 'dotenv'
import { ethers } from 'ethers';
import { getProvider } from '../../../lib/server/connections';
import { nftmarketaddress } from '../../../../config';
import HodlMarket from '../../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import { ipfsUriToCid } from '../../../lib/utils';
import apiRoute from '../handler';
import { getToken } from '../token/[tokenId]';

dotenv.config({ path: '../.env' })

// TODO: We don't actually read the blockchain to get the items listed for sale anymore
// We maintain this data in redis under the 'market:' key. This should be much faster than reading the blockchain.
// Keeping this for now as we may do a periodic check of the data using qStash or something


// TODO: We may wish to just return full Nfts here. See fetchNft.
// We exclude fields that we do not need at the moment.
// We use the same names/conventions as the <Nft> type where possible.
// And are returning the same fields as getHolding/getItems
const getItems = async (data) => {
    const tokenIdToListing = new Map();
    const tokenIds = [];

    for (const listing of data) {
        tokenIdToListing.set(Number(listing.tokenId), listing);
        tokenIds.push(listing.tokenId);
    }

    const tokens = await Promise.all(
        tokenIds.map(id => getToken(id))
    );

    const items = tokens.filter(token => token).map(token => {
        const listing = tokenIdToListing.get(Number(token.id));

        return {
            price: listing ? ethers.utils.formatUnits(listing.price.toString(), 'ether') : '',
            tokenId: token.id,
            owner: listing ? listing.seller : '',
            forSale: true,
            image: ipfsUriToCid(token.image),
            mimeType: token.mimeType || null,
            filter: token.filter || null
        };
    });

    return items;
}


export const getListed = async (offset, limit) => {
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

    const data = await getListed(offset, limit);
    return res.status(200).json(data);
});


export default route;
