import { NextRequest, NextResponse } from 'next/server';
import { getAsString } from '../../../../lib/getAsString';


export const getLikeCount = async (comment) => {    
  const zcardResponse = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/zcard/likes:comment:${comment}`,
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

  const comment = getAsString(searchParams.get('id'));

  if (!comment) {
    return new Response(null, { status: 400 });
  }

  const count = await getLikeCount(+comment);

  return NextResponse.json(count);
};


export const config = {
  runtime: 'experimental-edge',
}
