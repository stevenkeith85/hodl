import { NextApiResponse } from "next";

import apiRoute from "../handler";
import { DeleteCommentValidationSchema } from "../../../validation/comments/deleteComment";
import { HodlComment } from "../../../models/HodlComment";
import { getMutableToken } from "../contracts/mutable-token/[tokenId]";
import { MutableToken } from "../../../models/Nft";
import { runRedisTransaction } from "../../../lib/database/rest/databaseUtils";
import { getComment } from "../../../lib/database/rest/getComment";
import { setComment } from "../../../lib/database/rest/setComment";
import { getCommentReplyCount } from "../../../lib/database/rest/getCommentReplyCount";

const route = apiRoute();

// TODO: Do we remove the 'likes comment' data? (Potential bug)
const removeComment = async (address, object, objectId, id, tokenId) : Promise<boolean> => {
  const count = await getCommentReplyCount(id);

  if (count === 0) { // remove the comment
    const cmds = [
      ['DEL', `comment:${id}`],

      ['ZREM', `user:${address}:comments`, id],

      ['ZREM', `${object}:${objectId}:comments`, id],

      // We always decrement the token id's comment count
      ['INCRBY', `token:${tokenId}:comments:count`, -1] 
    ];
  
    const success = await runRedisTransaction(cmds);
    return success;
  } else { // just change the text to "[deleted]"
    const comment: HodlComment = await getComment(id);
    comment.comment = "[deleted]";

    const success = await setComment(id, comment);
    return success;
  }
}

// TODO: CSRF
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

  const { object, objectId, subject, tokenId } = comment as HodlComment;

  // Read the blockchain to ensure what we are about to do is correct. (Potentially, we could rely on the cache at some point)
  const token: MutableToken = await getMutableToken(tokenId, true);

  const notTokenOwner = req.address !== token.hodler;
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
