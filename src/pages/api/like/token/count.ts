import { NextRequest, NextResponse } from 'next/server';
import { zCard } from '../../../../lib/database/rest/zCard';
import { getAsString } from '../../../../lib/getAsString';


export const getLikeCount = async (token) => {    
  const count = await zCard(`likes:token:${token}`);
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
