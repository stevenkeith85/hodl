import { NextApiRequest, NextApiResponse } from "next";
import apiRoute from '../../handler';
import { FullToken } from "../../../../models/FullToken";
import { MutableToken } from "../../../../models/MutableToken";
import { Redis } from '@upstash/redis';
import { Token } from "../../../../models/Token";
import { getListingFromBlockchain } from '../market/listing/[tokenId]';
import { getTokenFromBlockchain } from '../token/[tokenId]';

const route = apiRoute();
const client = Redis.fromEnv()

export const updateMutableTokenCache = async (tokenId): Promise<MutableToken> => {
  // If a token is listed, delisted, or bought; we'll recache. 
  //
  // If no-one has visited the token in a while, then the cached data will disappear from redis
  // which will keep our storage costs down
  //
  // TODO: We might listen to generic transfer events in future 
  // in case stuff happens off-site. (user adds token to another market, etc)
  const timeToCache = 60 * 15;

  try {
    const listingPromise = getListingFromBlockchain(tokenId);
    const tokenPromise = getTokenFromBlockchain(tokenId);

    const [listing, token] = await Promise.all([listingPromise, tokenPromise]);

    let mutableToken = null;

    if (listing) {
      mutableToken = {
        forSale: true,
        hodler: listing.seller,
        price: listing.price
      }
    } else {
      mutableToken = {
        forSale: false,
        hodler: token.ownerOf,
        price: null
      }
    }
    await client.setex(`token:${tokenId}:mutable`, timeToCache, mutableToken);

    return mutableToken;
  } catch (e) {
    console.log('unable to update mutable token cache', e)
  }
}


export const getMutableToken = async (tokenId, skipCache = false): Promise<MutableToken> => {
  let mutableToken = skipCache ? null : await client.get<MutableToken>(`token:${tokenId}:mutable`);

  if (!mutableToken) {
    mutableToken = await updateMutableTokenCache(tokenId);
  }

  return mutableToken;
}

// This is more of a legacy convenience function. In reality we probably won't want a full token
// as it will be better to read the mutable data separate from the immutable data (for performance reasons).

// i.e. immutable data read times should be consistent and can be read server side for the UI
// but the mutable data should probably be read client side (in case we miss the cache)

// we can work on improving the caching so that we rarely if ever miss. (and still return the most up to date data)
export const getFullToken = async (id: number, skipCache = false): Promise<FullToken> => {
  const tokenPromise: Promise<Token> = client.get<Token>('token:' + id);
  const mutableTokenPromise: Promise<MutableToken> = getMutableToken(id, skipCache);

  const [token, mutableToken] = await Promise.all([tokenPromise, mutableTokenPromise]);

  if (!token) {
    console.log('api/nft cannot retrieve token')
    throw new Error('Error retrieving token');
  }

  // console.log('api/nft retrieved token', token);

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
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
    return res.status(200).json({ mutableToken })
  } catch (e) {
    return res.status(400).json({ message: 'Bad Request' });
  }
});

export default route;
