import { NextApiRequest, NextApiResponse } from "next";

import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from '../handler';

import { Redis } from '@upstash/redis';
import { HodlComment, HodlCommentViewModel } from "../../../models/HodlComment";
import { getUser } from "../user/[handle]";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

// const comment: HodlComment = await client.get(`comment:${id}`);

// if (comment) {
//   const vm: HodlCommentViewModel = {
//     id: comment.id,
//     user: await getUser(comment.subject),
//     comment: comment.comment,
//     timestamp: comment.timestamp,
//     // likes: await getCommentLikeCount(comment.id) TODO: We should really just return this here and mutate comments (rather than the likes/replies etc)
//   }

// export const getComment = memoize(async (id) => {
//   const comment = await client.get(`comment:${id}`);
//   return comment;
// }, { 
//   async: true,
//   primitive: true,
//   max: 10000, 
// });

export const getComment = async (id, withUser: boolean = true) : Promise<HodlCommentViewModel | null> => {
  if (!id) {
    return null;
  }

  const comment: HodlComment = await client.get(`comment:${id}`);

  if (comment) {
    const vm: HodlCommentViewModel = {
      id: comment.id,
      user: withUser ? await getUser(comment.subject): null,
      comment: comment.comment,
      timestamp: comment.timestamp,
      object: comment.object,
      tokenId: comment.tokenId
    }

    return vm;
  }
  
  return null;
}

route.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({message: 'Bad Request'});
  }

  const comment = await getComment(id);
  res.status(200).json(comment)
});

export default route;
