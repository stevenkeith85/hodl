import { Token } from "../../../../models/Token";
import { getTokens } from "../../../../lib/database/rest/Tokens";
import { getAsString } from "../../../../lib/getAsString";
import { NextRequest, NextResponse } from 'next/server';


export const getNewTokens = async (
  offset: number = 0,
  limit: number = 10
): Promise<
  {
    items: Token[],
    next: number,
    total: number
  }> => {
  const zcardResponse = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/zcard/tokens:new`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    });

  const { result: total } = await zcardResponse.json();

  if (offset >= total) {
    return {
      items: [],
      next: Number(offset) + Number(limit),
      total: Number(total)
    };
  }

  const idsResponse = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/zrange/tokens:new/${offset}/${offset + limit - 1}/rev`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    });

  const { result: ids } = await idsResponse.json();
  const tokens = await getTokens(ids);

  return {
    items: tokens,
    next: Number(offset) + Number(limit),
    total: Number(total)
  };
}

export default async function getLatestTokens (req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  const { searchParams } = new URL(req.url);

  const offset = getAsString(searchParams.get('offset'));
  const limit = getAsString(searchParams.get('limit'));

  if (!offset || !limit) {
    return new Response(null, { status: 400 });
  }

  const tokens = await getNewTokens(+offset, +limit);

  return NextResponse.json(tokens);
};

export const config = {
  runtime: 'experimental-edge',
}
