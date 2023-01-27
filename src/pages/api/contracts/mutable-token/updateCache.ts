import { NextApiResponse } from "next";
import apiRoute from '../../handler';
import { Redis } from '@upstash/redis';
import { getListingFromBlockchain } from '../market/listing/[tokenId]';
import { getTokenFromBlockchain } from '../token/[tokenId]';
import { getAsString } from "../../../../lib/getAsString";
import { MutableToken } from "../../../../models/MutableToken";

const route = apiRoute();
const client = Redis.fromEnv()

export const updateCache = async (id) => {
  const listingPromise = getListingFromBlockchain(id);
  const tokenPromise = getTokenFromBlockchain(id);

  const [listing, token] = await Promise.all([listingPromise, tokenPromise]);

  let mutableToken: MutableToken = null;

  if (listing) {
    mutableToken = {
      forSale: true,
      hodler: listing.seller,
      price: listing.price,
      royaltyFeeInBasisPoints: token.royaltyFeeInBasisPoints
    }
  } else {
    mutableToken = {
      forSale: false,
      hodler: token.ownerOf,
      price: null,
      royaltyFeeInBasisPoints: token.royaltyFeeInBasisPoints
    }
  }
  await client.set(`token:${id}:mutable`, mutableToken);
}


route.post(async (req, res: NextApiResponse) => {
  if (req.query.secret !== process.env.ZEPLO_SECRET) {
    return res.status(401).json({ message: 'unauthenticated' });
  }

  const id = getAsString(req.body.id);

  try {
    await updateCache(id)
  } catch (e) {
    return res.status(400).json({ message: e.message })
  }


  return res.status(200).json({ message: 'success' });
});


export default route;
