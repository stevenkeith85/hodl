import { NextRequest, NextResponse } from 'next/server';
import { get } from '../../../lib/database/rest/get';
import { zCard } from '../../../lib/database/rest/zCard';
import { getAsString } from '../../../lib/getAsString';
import { CommentCountValidationSchema } from '../../../validation/comments/commentCount';


export const getCommentCount = async (object, id) => {
  if (object === "comment") {
    const count = await zCard(`comment:${id}:comments`);
    return count || 0;
  } else {
    const count = await get(`token:${id}:comments:count`);
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

  const isValid = await CommentCountValidationSchema.isValid({ object, id })
  if (!isValid) {
    return new Response(null, { status: 400 });
  }

  const count = await getCommentCount(object, id);
  return NextResponse.json(count);
};


export const config = {
  runtime: 'experimental-edge',
}
