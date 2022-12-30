import { NextApiResponse } from "next";
import apiRoute from "../handler";
import { HodlComment } from "../../../models/HodlComment";
import { getMutableToken } from "../contracts/mutable-token/[tokenId]";
import { MutableToken } from "../../../models/MutableToken";
import { getComment } from "../../../lib/database/rest/getComment";
import { UnpinCommentValidationSchema } from "../../../validation/comments/unpin";
import { get } from "../../../lib/database/rest/get";
import { del } from "../../../lib/database/rest/del";


export const unpinComment = async (comment: HodlComment): Promise<boolean> => {
  const success = await del(`token:${comment.tokenId}:comments:pinned`);

  return Boolean(success);
}

const route = apiRoute();

route.delete(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const isValid = await UnpinCommentValidationSchema.isValid(req.body);

  if (!isValid) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const { commentId } = req.body;

  const comment: HodlComment = await getComment(commentId);
  if (!comment) {
    // comment must exist and must be under this token
    return res.status(400).json({ message: 'Bad Request' });
  }

  const token: MutableToken = await getMutableToken(comment?.tokenId, req);
  if (!token) {
    // cached value not there for some reason
    return res.status(400).json({ message: 'Bad Request' });
  }

  if (req.address !== token?.hodler) {
    // only the hodler can unpin comments on their token
    return res.status(400).json({ message: 'Bad Request' });
  }

  const pinnedCommentId = await get(`token:${comment?.tokenId}:comments:pinned`);

  if (Number(pinnedCommentId) !== Number(comment?.id)) {
    return res.status(400).json({ message: 'This comment is not pinned' });
  }

  const success = await unpinComment(comment);

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(200).json({ message: 'pin was not removed' });
  }
});

export default route;
