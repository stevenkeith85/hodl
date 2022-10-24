import { NextApiRequest, NextApiResponse } from 'next'

import { Token } from "../../../../models/Token";
import { getTokens } from "../../../../lib/database/Tokens";
import { getAsString } from "../../../../lib/getAsString";


export const getNewTokens = async (
  offset: number = 0,
  limit: number = 10
): Promise<
  {
    items: Token[],
    next: number,
    total: number
  }> => {
  const cardResponse = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/zcard/tokens:new`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    });

  const { result: total } = await cardResponse.json();

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

// TODO: Lock down to GET requests
export default async function getLatestTokens (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { searchParams } = new URL(req.url);

  const offset = getAsString(searchParams.get('offset'));
  const limit = getAsString(searchParams.get('limit'));

  if (!offset || !limit) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const tokens = await getNewTokens(+offset, +limit);

  return new Response(JSON.stringify(tokens), { status: 200, headers: { 'content-type': 'application/json'}})
};

export const config = {
  runtime: 'experimental-edge',
}
