import { NextRequest, NextResponse } from 'next/server';
import { getAsString } from '../../../lib/getAsString';


export const getFollowersCount = async (address) => {    
  const zcardResponse = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/zcard/user:${address}:followers`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    });

  const { result: count } = await zcardResponse.json();

  return count || 0;
}


export default async function route (req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  const { searchParams } = new URL(req.url);

  const address = getAsString(searchParams.get('address'));

  if (!address) {
    return new Response(null, { status: 400 });
  }

  const count = await getFollowersCount(address);

  return NextResponse.json(count);
};


export const config = {
  runtime: 'experimental-edge',
}
