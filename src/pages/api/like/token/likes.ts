import { NextRequest, NextResponse } from 'next/server';
import { getAsString } from '../../../../lib/getAsString';


export const likesToken = async (address, token) => {
  const zscoreResponse = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/zscore/liked:tokens:${address}/${token}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      },
      keepalive: true
    });

  const { result: likes } = await zscoreResponse.json();

  return Boolean(likes);
}


// TODO: We NEED a batch lookup for this
// TODO: We should perhaps add auth here
// TODO: We'd need to migrate away from jsonwebtoken though as that uses node libs. (jose perhaps)
export default async function route(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  const { searchParams } = new URL(req.url);

  const token = getAsString(searchParams.get('id'));
  const address = getAsString(searchParams.get('address'));

  if (!token || !address) {
    return new Response(null, { status: 400 });
  }

  const likes = await likesToken(address, token);

  return NextResponse.json({ likes });
};


export const config = {
  runtime: 'experimental-edge',
}
