import { NextApiResponse } from "next";

import dotenv from 'dotenv'
import apiRoute from '../handler';

import { Redis } from '@upstash/redis';
import { HodlComment, HodlCommentViewModel } from "../../../models/HodlComment";
import { getUser } from "../user/[handle]";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getComment = async (id, withUser: boolean = true, viewer: string = null): Promise<HodlCommentViewModel | null> => {
  if (!id) {
    return null;
  }

  const comment: HodlComment = await client.get(`comment:${id}`);

  if (comment) {
    const vm: HodlCommentViewModel = {
      id: comment.id,
      user: withUser ? await getUser(comment.subject, viewer) : null,
      comment: comment.comment,
      timestamp: comment.timestamp,
      object: comment.object,
      objectId: comment.objectId,
      tokenId: comment.tokenId
    }

    return vm;
  }

  return null;
}

route.get(async (req, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const comment = await getComment(id, true, req?.address);
  res.status(200).json(comment)
});

export default route;
