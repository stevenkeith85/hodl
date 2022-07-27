import dotenv from 'dotenv'
import { ipfsUriToCid } from '../../../lib/utils';
import apiRoute from '../handler';
import { getToken } from '../token/[tokenId]';
import { Redis } from '@upstash/redis';
import { ethers } from 'ethers';
import { nftaddress, nftmarketaddress } from '../../../config';
import { getProvider } from '../../../lib/server/connections';
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import HodlMarket from '../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json'
import { SearchValidationSchema } from '../../../validationSchema/search';

import axios from 'axios';
import { Token } from '../../../models/Token';

const client = Redis.fromEnv()

dotenv.config({ path: '../.env' })

// const isTokenForSale = ({ price, seller, tokenId }) => {
//     return price !== ethers.constants.Zero &&
//         seller !== ethers.constants.AddressZero &&
//         tokenId !== ethers.constants.Zero;
// }

// TODO: This can maybe go once we've got the token/market interaction on the website sorted
// const getItems = async (tokenIds) => {
//     const provider = await getProvider();
//     const tokenContract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
//     const marketContract = new ethers.Contract(nftmarketaddress, HodlMarket.abi, provider);

//     const tokens = await Promise.all(
//         tokenIds.map(id => getToken(id))
//     );

//     const items = Promise.all(tokens.filter(token => token).map(async token => {
//         const listing = await marketContract.getListing(token.tokenId);
//         const owner = await tokenContract.ownerOf(token.tokenId);

//         return {
//             tokenId: token.tokenId,
//             name: token.name,
//             seller: listing.seller !== ethers.constants.AddressZero ? listing.seller : null,
//             forSale: isTokenForSale(listing),
//             price: isTokenForSale(listing) ? ethers.utils.formatUnits(listing.price.toString(), 'ether') : null,
//             owner,
//             image: ipfsUriToCloudinaryUrl(token.image),
//             mimeType: token.mimeType || null,
//             filter: token.filter || null
//         };
//     }));

//     return items;
// }


export const getSearchResults = async (q, offset, limit) => {
    try {
        let ids = []
        const tokens = [];
        let total = 0;

        const tag = q;

        if (tag) {
            const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/tag:${tag}/${offset}/${offset + limit - 1}/rev`, {
                headers: {
                    Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
                }
            })
            ids = r.data.result
            total = await client.zcard(`tag:${tag}`);
        } else {
            const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/tokens/${offset}/${offset + limit - 1}/rev`, {
                headers: {
                    Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
                }
            })
            ids = r.data.result
            total = await client.zcard(`tokens`);
        }

        if (ids.length) {
            for (const id of ids) {
                const data = await client.get<Token>(`token:${id}`);

                if (data) {
                    tokens.push(data);
                }
            }
        }

        return { items: tokens, next: Number(offset) + Number(ids.length), total: Number(total) };
    } catch (e) {
        return { items: [], next: 0, total: 0 };
    }
}


const route = apiRoute();
route.get(async (req, res) => {
    const { q, offset, limit } = req.query;

    const data = await getSearchResults(q, offset, limit);
    return res.status(200).json(data);
});


export default route;
