import { NextApiRequest, NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from "../handler";
import { isValidAddress } from "../../../lib/profile";
import axios from 'axios'
import { getAsString } from "../../../lib/utils";
import { User } from "../../../models/User";
import { getUser } from "../user/[handle]";


dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

// TODO: getFollowers and getFollowing are almost the same pattern. 
// Seems like getting a list of users could be a shared
// function that a few API endpoints could make use of
export const getFollowing = async (address: string, offset: number = 0, limit: number = 10) => {
  try {
    const users: User[] = [];
    const total = await client.zcard(`user:${address}:following`);

    if (offset >= total) {
      return {
        items: users,
        next: Number(total),
        total: Number(total)
      };
    }

    const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/user:${address}:following/${offset}/${offset + limit - 1}/rev`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    })


    const addresses: string[] = r.data.result;

    if (addresses.length) {
      for (const address of addresses) {
        const data = await getUser(address);

        if (data) {
          users.push(data);
        }
      }
    }


    return { items: users, next: Number(offset) + Number(users.length), total: Number(total) };
  } catch (e) {
    return { items: [], next: 0, total: 0 };
  }
}

// export const getFollowing = async (address: string, offset: number = 0, limit: number = 10) => {
//   try {
//     const total = await client.zcard(`user:${address}:following`);

//     if (offset >= total) {
//       return { items: [], next: Number(total), total: Number(total) };
//     }

//     const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/user:${address}:following/${offset}/${offset + limit - 1}/rev`, {
//       headers: {
//         Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
//       }
//     })
//     const following = r.data.result


//     return { items: following, next: Number(offset) + Number(following.length), total: Number(total) };
//   } catch (e) {
//     return { items: [], next: 0, total: 0 };
//   }
// }

route.get(async (req: NextApiRequest, res: NextApiResponse) => {  
  const address = getAsString(req.query.address);
  const offset = getAsString(req.query.offset);
  const limit = getAsString(req.query.limit);

  if (!address || !offset || !limit) {
    return res.status(400).json({ message: 'Bad Request' });
  }
  
  const following = await getFollowing(address, +offset, +limit);
  res.status(200).json(following);
});

export default route;
