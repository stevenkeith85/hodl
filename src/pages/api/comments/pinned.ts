import { NextRequest, NextResponse } from 'next/server';
import { get } from '../../../lib/database/rest/get';
import { getCommentVM } from '../../../lib/database/rest/getCommentVM';
import { getAsString } from '../../../lib/getAsString';
import { PinnedCommentValidationSchema } from '../../../validation/comments/pinnedComment';


export const getPinnedComment = async (id) => {
    const commentId = await get(`token:${id}:comments:pinned`);
    
    if (commentId) {
      return await getCommentVM(commentId);
    }
  
    return null;
}


export default async function route(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  const { searchParams } = new URL(req.url);

  const id = getAsString(searchParams.get('id'));

  const isValid = await PinnedCommentValidationSchema.isValid({ id })
  if (!isValid) {
    return new Response(null, { status: 400 });
  }

  const count = await getPinnedComment(id);
  return NextResponse.json(count);
};


export const config = {
  runtime: 'experimental-edge',
}
