import { NextApiRequest, NextApiResponse } from "next";
import dotenv from 'dotenv'
import apiRoute from '../../handler';
import { MutableToken, FullToken } from '../../../../models/Nft';
import { Redis } from '@upstash/redis';
import { Token } from '../../../../models/Token';
import { getListingFromBlockchain } from '../market/listing/[tokenId]';
import { getTokenFromBlockchain } from '../token/[tokenId]';

dotenv.config({ path: '../.env' })

const route = apiRoute();
const client = Redis.fromEnv()

export const getMutableToken = async (tokenId, skipCache = false): Promise<MutableToken> => {
  let mutableToken = skipCache ? null : await client.get<MutableToken>(`token:${tokenId}:mutable`);

  if (!mutableToken) {
    console.log('getMutableToken - cache miss - reading blockchain');

    const listing = await getListingFromBlockchain(tokenId);

    if (listing) {
      mutableToken = {
        forSale: true,
        hodler: listing.seller,
        price: listing.price
      }
    } else {
      const token = await getTokenFromBlockchain(tokenId);
      mutableToken = {
        forSale: false,
        hodler: token.ownerOf,
        price: null
      }
    }

    client.setex(`token:${tokenId}:mutable`, 60 * 10, mutableToken); // cache for 10 mins
  } else {
    console.log('getMutableToken - cache hit - reading redis');
  }

  return mutableToken;

}

// This is more of a legacy convenience function. In reality we probably won't want a full token
// as it will be better to read the mutable data separate from the immutable data (for performance reasons).

// i.e. immutable data read times should be consistent and can be read server side for the UI
// but the mutable data should probably be read client side (in case we miss the cache)

// we can work on improving the caching so that we rarely if ever miss. (and still return the most up to date data)
export const getFullToken = async (id: number, skipCache=false): Promise<FullToken> => {
  const tokenPromise: Promise<Token> = client.get<Token>('token:' + id);
  const mutableTokenPromise: Promise<MutableToken> = getMutableToken(id, skipCache);

  const [token, mutableToken] = await Promise.all([tokenPromise, mutableTokenPromise]);

  if (!token) {
    console.log('api/nft cannot retrieve token')
    throw new Error('Error retrieving token');
  }

  console.log('api/nft retrieved token', token);

  const result: FullToken = {
    ...token,
    ...mutableToken
  }

  return result;
}


route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { tokenId } = req.query;

  if (!tokenId) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  try {
    const mutableToken = await getMutableToken(+tokenId);
    return res.status(200).json({ mutableToken })
  } catch (e) {
    return res.status(400).json({ message: 'Bad Request' });
  }
});

export default route;
