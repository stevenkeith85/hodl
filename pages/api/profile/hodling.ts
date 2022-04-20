// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dotenv from 'dotenv'
import { ethers } from 'ethers';
import { getProvider } from '../../../lib/server/connections';

import { nftaddress } from '../../../config';
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { ipfsUriToCloudinaryUrl } from '../../../lib/utils';

import apiRoute from '../handler';

dotenv.config({ path: '../.env' })

const addressToTokenIds = async (address, offset, limit) => {
    const provider = await getProvider();
    const tokenContract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
    const result = await tokenContract.addressToTokenIds(address, offset, limit);
    return result;
}

export const fetchNftsInWallet = async (address, offset, limit) => {
    try {
        const [tokenIds, next, total] = await addressToTokenIds(address, offset, limit);

        if (!tokenIds.length) {
            return {items: [], next: 0, total: 0};
        }

        const tokens = await Promise.all(
            tokenIds.map(id => fetch(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/token/${id}`).then(r => r.json()).then(json => json.token))
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

        return {items, next: Number(next), total: Number(total)};
    } catch(e) {
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

    const data = await fetchNftsInWallet(address, offset, limit)

    return res.status(200).json({data});
});


export default route;
