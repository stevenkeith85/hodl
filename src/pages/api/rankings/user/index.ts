import { getAsString } from "../../../../lib/getAsString";
import { NextRequest, NextResponse } from 'next/server';
import { UserViewModel } from "../../../../models/User";
import { getUsers } from "../../../../lib/database/rest/Users";
import { zCard } from "../../../../lib/database/rest/zCard";
import { zRange } from "../../../../lib/database/rest/zRange";

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
  const total = await zCard('rankings:user:followers:count');

  if (offset >= total) {
    return {
      items: [],
      next: Number(offset) + Number(limit),
      total: Number(total)
    };
  }
  const addresses = await zRange(`rankings:user:followers:count`, offset, offset + limit - 1, {rev:true});
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

  return NextResponse.json(tokens, {
    headers: {
      'Cache-Control': 'max-age=0, s-maxage=60'
    }
  });
};

export const config = {
  runtime: 'experimental-edge',
}
