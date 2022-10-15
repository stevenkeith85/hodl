import { NextApiRequest, NextApiResponse } from "next";
import dotenv from 'dotenv'
import apiRoute from '../../../handler';
import { getListingFromBlockchain } from '../../market/listing/[tokenId]';
import { getTokenFromBlockchain } from '.';
import { Redis } from '@upstash/redis';


dotenv.config({ path: '../.env' })

const route = apiRoute();
const client = Redis.fromEnv();

export const getHodlerAddress = async (tokenId, skipCache = false)  => {

  let hodler = skipCache ? null : await client.get<string>(`token:${tokenId}:hodler`);

  if (!hodler) {
    console.log('getHodlerAddress - cache miss - reading blockchain');
    const listing = await getListingFromBlockchain(tokenId);

    if (listing) {
      hodler = listing.seller;
    } else {
      const token = await getTokenFromBlockchain(tokenId);
      hodler = token.ownerOf;
    }

    client.setex(`token:${tokenId}:hodler`, 60 * 10, hodler); // cache for 10 mins
  } else {
    console.log('getHodlerAddress - cache hit - reading redis');
  }

  return hodler;

}


route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { tokenId } = req.query;

  if (!tokenId) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  try {
    const hodler = await getHodlerAddress(+tokenId);
    return res.status(200).json({ hodler })
  } catch (e) {
    return res.status(400).json({ message: 'Bad Request' });
  }
});

export default route;
