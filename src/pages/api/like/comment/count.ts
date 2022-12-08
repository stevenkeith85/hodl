import { NextRequest, NextResponse } from 'next/server';
import { zCard } from '../../../../lib/database/rest/zCard';
import { getAsString } from '../../../../lib/getAsString';


export const getLikeCount = async (comment) => {    
  const count = await zCard(`likes:comment:${comment}`);
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
