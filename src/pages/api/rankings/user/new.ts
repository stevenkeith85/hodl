import { getAsString } from "../../../../lib/getAsString";
import { NextRequest, NextResponse } from 'next/server';
import { UserViewModel } from "../../../../models/User";
import { getUsers } from "../../../../lib/database/rest/Users";

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
  const zcardResponse = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/zcard/users:new`,
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
    `${process.env.UPSTASH_REDIS_REST_URL}/zrange/users:new/${offset}/${offset + limit - 1}/rev`,
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

  if (+limit > 100) {
    return new Response(null, { status: 400 });
  }

  const tokens = await getNewUsers(+offset, +limit);

  return NextResponse.json(tokens, {
    headers: {
      'Cache-Control': 'max-age=0, s-maxage=60'
    }
  });
};

export const config = {
  runtime: 'experimental-edge',
}
