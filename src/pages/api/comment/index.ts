import { NextApiResponse } from "next";

import apiRoute from '../handler';

import { Redis } from '@upstash/redis';
import { HodlComment, HodlCommentViewModel } from "../../../models/HodlComment";
import { getUser } from "../user/[handle]";

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

// TODO: Potentially convert to edge function
route.get(async (req, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const comment = await getComment(id, true, req?.address);

  // You can't edit comments but.. we edit them on the users behalf sometimes. 
  // i.e. when they delete a comment that has replies we change the comment to [deleted]
  
  // Serve from cache; but revalidate it if requested after 1 second. 
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
  res.status(200).json(comment)
});

export default route;
