import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../../handler";
import { UserViewModel } from "../../../../models/User";
import { getUser } from "../../user/[handle]";
import { getAsString } from "../../../../lib/utils";
import { getToken } from "../../token/[tokenId]";
import { Token } from "../../../../models/Token";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

// TODO: Possibly rename 'rankings' to 'stats' as its not just 'rankings'. i.e. in this case we are getting the 
// most recent tokens added to the site.

// data structures:
//
// ZSET (tokens:new) <address> and the time they added the token (limited to a max size as it is used on the UI and we want to keep things fast)

export const getNewTokens = async (
  offset: number = 0,
  limit: number = 10
): Promise<
  {
    items: Token[],
    next: number,
    total: number
  }> => {

  const total = await client.zcard(`tokens:new`);

  if (offset >= total) {
    return {
      items: [],
      next: Number(offset) + Number(limit),
      total: Number(total)
    };
  }

  const ids: number[] = await client.zrange(`tokens:new`, offset, offset + limit - 1, { rev: true });
  const promises = ids.map(id => getToken(id));
  const tokens = await Promise.all(promises);

  return {
    items: tokens,
    next: Number(offset) + Number(limit),
    total: Number(total)
  };
}

route.get(async (req, res: NextApiResponse) => {
  const offset = getAsString(req.query.offset);
  const limit = getAsString(req.query.limit);

  if (!offset || !limit) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const addresses = await getNewTokens(+offset, +limit);

  res.status(200).json(addresses);

});


export default route;
