import { Token } from "../../../../models/Token";
import { mGetTokensWithFields } from "../../../../lib/database/rest/Tokens";
import { getAsString } from "../../../../lib/getAsString";
import { NextRequest, NextResponse } from 'next/server';
import { zCard } from "../../../../lib/database/rest/zCard";
import { zRange } from "../../../../lib/database/rest/zRange";


export const getNewTokens = async (
  offset: number = 0,
  limit: number = 10
): Promise<
  {
    items: Token[],
    next: number,
    total: number
  }> => {

  const total = await zCard('tokens:new');

  if (offset >= total) {
    return {
      items: [],
      next: Number(offset) + Number(limit),
      total: Number(total)
    };
  }

  const ids = await zRange(`tokens:new`, offset, offset + limit - 1, {rev:true})
  const tokens = await mGetTokensWithFields(ids, ['id', 'name', 'image', 'properties']);

  return {
    items: tokens,
    next: Number(offset) + Number(limit),
    total: Number(total)
  };
}

export default async function route(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  const { searchParams } = new URL(req.url);

  const offset = getAsString(searchParams.get('offset'));
  const limit = getAsString(searchParams.get('limit'));

  if (!offset || !limit) {
    return new Response(null, { status: 400 });
  }

  // We only allow 100 items at a time
  if (+limit > 100) {
    return new Response(null, { status: 400 });
  }

  const tokens = await getNewTokens(+offset, +limit);

  return NextResponse.json(tokens, {
    headers: {
      'Cache-Control': 'max-age=0, s-maxage=60'
    }
  });
};

export const config = {
  runtime: 'experimental-edge',
}
