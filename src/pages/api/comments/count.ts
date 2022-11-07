import { NextRequest, NextResponse } from 'next/server';
import { getAsString } from '../../../lib/getAsString';
import { CommentCountValidationSchema } from '../../../validation/comments/commentCount';


export const getCommentCount = async (object, id) => {
  if (object === "comment") {
    const zcardResponse = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/zcard/comment:${id}:comments`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        }
      });

    const { result: count } = await zcardResponse.json();

    return count || 0;
  } else {
    const zcardResponse = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/token:${id}:comments:count`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        }
      });

    const { result: count } = await zcardResponse.json();
    return count || 0;
  }
}


export default async function route(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  const { searchParams } = new URL(req.url);

  const object = getAsString(searchParams.get('object'));
  const id = getAsString(searchParams.get('id'));

  const isValid = await CommentCountValidationSchema.isValid({object, id})
  if (!isValid) {
    return new Response(null, { status: 400 });
  }

  const count = await getCommentCount(object, id);

  return NextResponse.json(count, {
    headers: {
      'Cache-Control': 's-maxage=1, stale-while-revalidate',
    }
  });
};


export const config = {
  runtime: 'experimental-edge',
}
