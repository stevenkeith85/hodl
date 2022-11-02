// import { NextApiResponse } from "next";
// import { Redis } from '@upstash/redis';

// import apiRoute from "../../handler";
// import { UserViewModel } from "../../../../models/User";


// import { getUserVMs } from "../../../../lib/database/client/userVMs";
// import { getAsString } from "../../../../lib/getAsString";


// const client = Redis.fromEnv()
// const route = apiRoute();

// // data structures:
// //
// // ZSET (rankings:user:followers) <address> and their follower count

// export const getMostFollowedUsers = async (
//   offset: number = 0,
//   limit: number = 10,
//   viewer: string = null
// ): Promise<
//   {
//     items: UserViewModel[],
//     next: number,
//     total: number
//   }> => {

//   const total = await client.zcard(`rankings:user:followers:count`);

//   if (offset >= total) {
//     return {
//       items: [],
//       next: Number(offset) + Number(limit),
//       total: Number(total)
//     };
//   }

//   const addresses: string[] = await client.zrange(`rankings:user:followers:count`, offset, offset + limit - 1, { rev: true });
//   const userVMs = await getUserVMs(addresses);
  
//   return {
//     items: userVMs,
//     next: Number(offset) + Number(limit),
//     total: Number(total)
//   };
// }

// route.get(async (req, res: NextApiResponse) => {
//   const offset = getAsString(req.query.offset);
//   const limit = getAsString(req.query.limit);

//   if (!offset || !limit) {
//       return res.status(400).json({ message: 'Bad Request' });
//   }

//   const addresses = await getMostFollowedUsers(+offset, +limit, req?.address);

//   res.status(200).json(addresses);

// });


// export default route;

import { getAsString } from "../../../../lib/getAsString";
import { NextRequest, NextResponse } from 'next/server';
import { UserViewModel } from "../../../../models/User";
import { getUsers } from "../../../../lib/database/rest/Users";

export const getTopUsers = async (
  offset: number = 0,
  limit: number = 10,
  viewer: string = null // address of logged in user
): Promise<
  {
    items: UserViewModel[],
    next: number,
    total: number
  }> => {
  const zcardResponse = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/zcard/rankings:user:followers:count`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    });

  const { result: total } = await zcardResponse.json();

  if (offset >= total) {
    return {
      items: [],
      next: Number(offset) + Number(limit),
      total: Number(total)
    };
  }

  const idsResponse = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/zrange/rankings:user:followers:count/${offset}/${offset + limit - 1}/rev`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    });

  const { result: addresses } = await idsResponse.json();
  const users = await getUsers(addresses);

  return {
    items: users,
    next: Number(offset) + Number(limit),
    total: Number(total)
  };
}

export default async function getLatestUsers (req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  const { searchParams } = new URL(req.url);

  const offset = getAsString(searchParams.get('offset'));
  const limit = getAsString(searchParams.get('limit'));

  if (!offset || !limit) {
    return new Response(null, { status: 400 });
  }

  const tokens = await getTopUsers(+offset, +limit);

  return NextResponse.json(tokens);
};

export const config = {
  runtime: 'experimental-edge',
}
