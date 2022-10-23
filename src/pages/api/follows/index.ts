import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';

import apiRoute from "../handler";

const client = Redis.fromEnv()
const route = apiRoute();


export const isFollowing = async (address1, address2) => {

  if (!address1 || !address2) {
    return 0;
  }

  const follows = await client.zscore(`user:${address1}:following`, address2);
  return follows;
}

route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { address1, address2 } = req.query;

  if (!address1 || !address2) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const follows = await isFollowing(address1, address2);
  res.status(200).json({follows});
});


export default route;
