import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../../handler";
import { UserViewModel } from "../../../../models/User";
import { getUser } from "../../user/[handle]";
import { getAsString } from "../../../../lib/utils";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

// TODO: Possibly rename 'rankings' to 'stats' as its not just 'rankings'. i.e. in this case we are getting the 
// most recent users who have joined the site.

// data structures:
//
// ZSET (users:new) <address> and the time they joined (limited to a max size as it is used on the UI)

export const getNewUsers = async (
  offset: number = 0,
  limit: number = 10,
  viewer: string = null // address of logged in user
): Promise<
  {
    items: UserViewModel[],
    next: number,
    total: number
  }> => {

  const total = await client.zcard(`users:new`);

  if (offset >= total) {
    return {
      items: [],
      next: Number(offset) + Number(limit),
      total: Number(total)
    };
  }

  const addresses: string[] = await client.zrange(`users:new`, offset, offset + limit - 1, { rev: true });
  const promises = addresses.map(address => getUser(address, viewer));
  const users: UserViewModel[] = await Promise.all(promises);
  
  return {
    items: users,
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

  const addresses = await getNewUsers(+offset, +limit, req?.address);

  res.status(200).json(addresses);

});


export default route;
