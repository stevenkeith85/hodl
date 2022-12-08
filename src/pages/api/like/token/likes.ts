import { NextRequest, NextResponse } from 'next/server';
import { zScore } from '../../../../lib/database/rest/zScore';
import { getAsString } from '../../../../lib/getAsString';


export const likesToken = async (address, token) => {
  const score = await zScore(`liked:tokens:${address}`, token)
  return Boolean(score);
}

// TODO: Potentially could be auth'd. Would require us having a jwt implementation that supports the edge runtime though
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
