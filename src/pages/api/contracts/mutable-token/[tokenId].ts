import { NextApiRequest, NextApiResponse } from "next";
import apiRoute from '../../handler';
import { MutableToken } from "../../../../models/MutableToken";
import { Redis } from '@upstash/redis';
import { addToZeplo } from "../../../../lib/addToZeplo";


const route = apiRoute();
const client = Redis.fromEnv()


export const getMutableToken = async (id, req = null): Promise<MutableToken> => {
  let mutableToken = await client.get<MutableToken>(`token:${id}:mutable`);

  if (!mutableToken && req) {
    addToZeplo(
      'api/contracts/mutable-token/updateCache',
      {
        id
      },
      req.cookies.refreshToken,
      req.cookies.accessToken
    )
  }

  return mutableToken;
}


route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { tokenId } = req.query;

  if (!tokenId) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  try {
    const mutableToken = await getMutableToken(+tokenId, req);
    return res.status(200).json({ mutableToken })
  } catch (e) {
    return res.status(400).json({ message: 'Bad Request' });
  }
});

export default route;
