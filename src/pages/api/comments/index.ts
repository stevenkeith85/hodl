import { NextRequest, NextResponse } from 'next/server';
import { getCommentVMs } from '../../../lib/database/rest/Comments';
import { zCard } from '../../../lib/database/rest/zCard';
import { zRange } from '../../../lib/database/rest/zRange';
import { getAsString } from '../../../lib/getAsString';
import { GetCommentsValidationSchema } from '../../../validation/comments/getComments';


export const getCommentsForObject = async (
  object: "token" | "comment",
  objectId: number,
  offset: number,
  limit: number,
  reverse = false
) => {

  const total = await zCard(`${object}:${objectId}:comments`);

  if (offset >= total) {
    return {
      items: [],
      next: Number(offset) + Number(limit),
      total: Number(total)
    };
  }

  const ids = await zRange(`${object}:${objectId}:comments`, offset, offset + limit - 1, { rev: reverse });
  
  const result = await getCommentVMs(ids);
  
  return {
    items: result,
    next: Number(offset) + Number(limit),
    total: Number(total)
  };
}

export default async function route(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  const { searchParams } = new URL(req.url);

  const object = getAsString(searchParams.get('object'));
  const objectId = getAsString(searchParams.get('objectId'));
  const offset = getAsString(searchParams.get('offset'));
  const limit = getAsString(searchParams.get('limit'));
  const rev = getAsString(searchParams.get('rev')) || "false";

  const isValid = await GetCommentsValidationSchema.isValid({ object, objectId, offset, limit, rev })
  if (!isValid) {
    return new Response(null, { status: 400 });
  }

  const tokens = await getCommentsForObject(object as "comment" | "token", +objectId, +offset, +limit, JSON.parse(rev));

  return NextResponse.json(tokens, {
    headers: {
    }
  });
};

export const config = {
  runtime: 'experimental-edge',
}
