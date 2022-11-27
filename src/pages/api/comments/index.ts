import { NextRequest, NextResponse } from 'next/server';
import { mGetComments } from '../../../lib/database/rest/Comments';
import { getUsers } from '../../../lib/database/rest/Users';
import { getAsString } from '../../../lib/getAsString';
import { GetCommentsValidationSchema } from '../../../validation/comments/getComments';


export const getCommentsForObject = async (
  object: "token" | "comment",
  objectId: number,
  offset: number,
  limit: number,
  reverse = false
) => {
  const zcardResponse = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/zcard/${object}:${objectId}:comments`,
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
    `${process.env.UPSTASH_REDIS_REST_URL}/zrange/${object}:${objectId}:comments/${offset}/${offset + limit - 1}${reverse ? '/rev' : ''}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    });

    // TODO: We can't json parse the scotland flag and stuff breaks. the website wont fall over; but a user adding a scotland flag will effectively 'delete' the comments section. noooooo!
  const { result: ids } = await idsResponse.json();
  const comments = await mGetComments(ids);

  const addresses: string[] = comments?.map(comment => comment.subject);
  const uniqueAddresses = new Set(addresses);

  const userVMs = uniqueAddresses.size ? await getUsers(Array.from(uniqueAddresses)) : [];

  // Create an address to user map so that we can extrapolate the comment info for the UI
  const userMap = userVMs.reduce((map, user) => {
    map[user.address] = user;
    return map;
  }, {});

  // The final result we'll give back to the FE
  const result = comments.map(comment => ({
    id: comment.id,
    user: userMap[comment.subject],
    comment: comment.comment,
    timestamp: comment.timestamp,
    object: comment.object,
    tokenId: comment.tokenId
  }));


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
