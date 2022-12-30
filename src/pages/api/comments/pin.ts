import { NextApiResponse } from "next";

import apiRoute from "../handler";
import { HodlComment } from "../../../models/HodlComment";
import { getMutableToken } from "../contracts/mutable-token/[tokenId]";
import { MutableToken } from "../../../models/MutableToken";
import { getComment } from "../../../lib/database/rest/getComment";
import { PinCommentValidationSchema } from "../../../validation/comments/pinComment";
import { set } from "../../../lib/database/rest/set";

const route = apiRoute();

const pinComment = async (comment: HodlComment): Promise<boolean> => {
  const success = await set(`token:${comment.tokenId}:comments:pinned`, comment.id);

  return Boolean(success);
}


// This could be vulnerable to CSRF. To prevent this we are setting the auth cookies to LAX.
// https://portswigger.net/web-security/csrf/samesite-cookies

// token owner can pin any comment on their token
route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const isValid = await PinCommentValidationSchema.isValid(req.body)

  if (!isValid) {
    return res.status(400).json({ message: 'Bad Request'});
  }

  const { commentId } = req.body;

  const comment: HodlComment = await getComment(commentId);
  if (!comment) {
    // comment must exist and must be under this token
    return res.status(400).json({ message: 'Bad Request'});
  }

  const token: MutableToken = await getMutableToken(comment?.tokenId, req);

  if (req.address !== token?.hodler) {
    // only the hodler can pin comments on their token
    return res.status(400).json({ message: 'Bad Request'});
  }

  const success = await pinComment(comment);

  // TODO:
  // Add an action to let the user know someone pinned their comment

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(200).json({ message: 'comment not pinned' });
  }
});

export default route;
