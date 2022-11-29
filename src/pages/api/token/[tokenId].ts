import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '../../../lib/database/rest/getToken';
import { getAsString } from '../../../lib/getAsString';


export default async function route (req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  const { searchParams } = new URL(req.url);

  const id = getAsString(searchParams.get('tokenId'));

  if (!id) {
    return new Response(null, { status: 400 });
  }

  const token = await getToken(+id);

  return NextResponse.json({token}, {
    headers: {
      'Cache-Control': 'max-age=0, immutable'
    }
  });
};


export const config = {
  runtime: 'experimental-edge',
}
