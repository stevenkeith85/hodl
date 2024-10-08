import { NextApiResponse } from "next";

import apiRoute from "../handler";
import { DeleteCommentValidationSchema } from "../../../validation/comments/deleteComment";
import { HodlComment } from "../../../models/HodlComment";
import { getMutableToken } from "../contracts/mutable-token/[tokenId]";
import { MutableToken } from "../../../models/MutableToken";
import { runRedisTransaction } from "../../../lib/database/rest/databaseUtils";
import { getComment } from "../../../lib/database/rest/getComment";
import { setComment } from "../../../lib/database/rest/setComment";
import { getCommentReplyCount } from "../../../lib/database/rest/getCommentReplyCount";
import { get } from "../../../lib/database/rest/get";
import { del } from "../../../lib/database/rest/del";

const route = apiRoute();

// TODO: Do we remove the 'likes comment' data? (Potential bug)
const removeComment = async (address, object, objectId, id, tokenId): Promise<boolean> => {
  const count = await getCommentReplyCount(id);

  if (count === 0) { // remove the comment

    const cmds = [
      ['DEL', `comment:${id}`],

      ['ZREM', `user:${address}:comments`, id],

      ['ZREM', `${object}:${objectId}:comments`, id],

      // We always decrement the token id's comment count
      ['INCRBY', `token:${tokenId}:comments:count`, -1]
    ];

    // if the comment to be deleted was a pinned comment, we should also remove that pin
    const pinnedCommentId = await get(`token:${tokenId}:comments:pinned`);

    if (Number(pinnedCommentId) === Number(id)) {
      cmds.push(
        ['DEL', `token:${tokenId}:comments:pinned`],
      )
    }

    const success = await runRedisTransaction(cmds);
    return success;
  } else { // just change the text to "[deleted]"
    const comment: HodlComment = await getComment(id);
    comment.comment = "[deleted]";

    const success = await setComment(id, comment);

    if (success) {
      // if the comment to be deleted was a pinned comment, we should also remove that pin
      const pinnedCommentId = await get(`token:${tokenId}:comments:pinned`);

      if (Number(pinnedCommentId) === Number(id)) {
        await del(`token:${tokenId}:comments:pinned`)
      }
    }

    return success;
  }
}

// This could be vulnerable to CSRF. To prevent this we are setting the auth cookies to LAX.
// https://portswigger.net/web-security/csrf/samesite-cookies

// user can remove their own comment. 
// token owner can remove any comment on their token
route.delete(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { id } = req.body;

  const isValid = await DeleteCommentValidationSchema.isValid(req.body)
  if (!isValid) {
    console.log('invalid params')
    return res.status(400).json({ message: 'Bad Request' });
  }

  const comment: HodlComment = await getComment(id);

  if (!comment) {
    console.log('trying to delete a non-existent comment')
    return res.status(400).json({ message: 'Bad Request' });
  }

  const { object, objectId, subject, tokenId } = comment;

  const token: MutableToken = await getMutableToken(tokenId, req);

  const notTokenOwner = req.address !== token?.hodler;
  const notMyComment = req.address !== subject;

  if (notMyComment && notTokenOwner) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const success = await removeComment(subject, object, objectId, id, tokenId);

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(200).json({ message: 'comment not deleted' });
  }
});


export default route;
