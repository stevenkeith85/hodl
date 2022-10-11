import dotenv from 'dotenv'
import { ethers } from 'ethers';
import { getProvider } from '../../../../../lib/server/connections';
import HodlNFT from '../../../../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import apiRoute from '../../../handler';
import { getToken } from '../../../token/[tokenId]';
import { Nft } from '../../../../../models/Nft';
import { Token } from '../../../../../models/Token';

dotenv.config({ path: '../.env' })

// The get hodling / get listed functionality should work fairly similar
// TODO: We may read more data from Redis in future if we can set up a decent blockchain/redis cache mechanism
const addressToTokenIds = async (address, offset, limit) => {
    const provider = getProvider();
    const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, HodlNFT.abi, provider);
    const result = await tokenContract.addressToTokenIds(address, offset, limit);
    return result;
}

export const getHodling = async (address, offset, limit) => {
    try {
        const [tokenIds, next, total] = await addressToTokenIds(address, offset, limit);

        if (!tokenIds.length) {
            return { items: [], next: 0, total: 0 };
        }

        const items : Nft [] = await Promise.all(tokenIds.map(async id => {
            const token: Token = await getToken(id);

            // If the token is present on the blockchain, 
            // but not in our database
            // we'll mark this as null.
            if (!token) {
                return null;
            }

            const nft : Nft = {
                ...token,
                owner: address,
                forSale: false,
                price: null
            };

            return nft;
        }));

        return { items, next: Number(next), total: Number(total) };
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

    const data = await getHodling(address, offset, limit)

    return res.status(200).json(data);
});


export default route;
