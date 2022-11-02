import { NextRequest, NextResponse } from 'next/server';
import { getAsString } from '../../../../lib/getAsString';


export const getLikeCount = async (token) => {    
  const zcardResponse = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/zcard/likes:token:${token}`,
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

  const token = getAsString(searchParams.get('id'));

  if (!token) {
    return new Response(null, { status: 400 });
  }

  const count = await getLikeCount(+token);

  return NextResponse.json(count);
};


export const config = {
  runtime: 'experimental-edge',
}
