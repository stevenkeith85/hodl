import { NextRequest, NextResponse } from 'next/server';
import { zScore } from '../../../../lib/database/rest/zScore';
import { getAsString } from '../../../../lib/getAsString';


export const likesComment = async (address, comment) => {
  const score = await zScore(`liked:comments:${address}`, comment)
  return Boolean(score);
}

// TODO: Potentially could be auth'd. Would require us having a jwt implementation that supports the edge runtime though
export default async function route(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  const { searchParams } = new URL(req.url);

  const comment = getAsString(searchParams.get('id'));
  const address = getAsString(searchParams.get('address'));

  if (!comment || !address) {
    return new Response(null, { status: 400 });
  }

  const likes = await likesComment(address, comment);

  return NextResponse.json({ likes });
};


export const config = {
  runtime: 'experimental-edge',
}
