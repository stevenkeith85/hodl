import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import apiRoute from "../handler";

import { ActionTypes } from "../../../models/HodlAction";
import { AddCommentValidationSchema } from "../../../validation/comments/addComments";
import { HodlComment } from "../../../models/HodlComment";

import { addToZeplo } from "../../../lib/addToZeplo";
import { runRedisTransaction } from "../../../lib/database/rest/databaseUtils";
import { jsonEscapeUTF } from "../../../lib/utils";

const client = Redis.fromEnv();
const route = apiRoute();

// Data Structures:
//
// Site:
// We have a counter for commentIds called <commentId>
// Comments made on HodlMM are stored as STRINGs that map to json.
// "comment:1" -> "{ subject, comment, token, object, objectId, timestamp }"
// "comment:2" -> "{ subject, comment, token, object, objectId, timestamp }"
// ...
// }
//
// They are added to the ZSET of total comments made on HodlMM. It maps comment ids to timestamps
// We don't have a feature that NEEDS this at the moment; but it could be useful to get a site wide picture of growth, etc
// comments -> { (1, 123456), (2, 223456), ...} 
//
// User:
// The user's comments are stored in a ZSET
// "user:0x1234:comments" -> (<id>/<time>, <id>/<time>, <id>/<time>) - We aren't storing this at the moment, as it can be calculated (if we need it) by doing a SET UNION
// "user:0x1234:comments:token" -> (<id>/<time>, <id>/<time>, <id>/<time>)
// "user:0x1234:comments:comment" -> (<id>/<time>, <id>/<time>, <id>/<time>)
//
// Token:
// The token's comments are stored in a ZSET
// "token:1:comments" -> (<id>/<time>, <id>/<time>, <id>/<time>)
//
// Comment:
// The comment's comments (i.e replies) are stored in a ZSET
// "comment:1:comments" -> (<id>/<time>, <id>/<time>, <id>/<time>)
//
// Aggregate:
// We store the the number of entries in the comment tree. i.e number of comments in the token's comment thread
// "token:1:comments:count" -> <number of comments made on the token's thread)
//
// Potentially, 
// We could update the token's json instead; (or use a HASH for token)
//
// ....but we are keeping that immutable at the moment for simplicity. 
//
// or store in a ZSET (which we may do later for 'rankings')

export const addComment = async (comment: HodlComment, req) => {
  comment.timestamp = Date.now();

  const commentId = await client.incr("commentId")
  comment.id = commentId;
  
  // Safer to store unicode code points for the astral plane; as just storing what comes from the UI caused us problems.
  let commentPayload = jsonEscapeUTF(JSON.stringify(comment)); 

  // return ;
  const cmds = [
    // Store the comment
    ['SET', `comment:${commentId}`, commentPayload],

    // Add the comment to the users collection
    ['ZADD', `user:${comment.subject}:comments`, comment.timestamp, commentId],

    // Add the comment to the token's (or comment's) collection
    ['ZADD', `${comment.object}:${comment.objectId}:comments`, comment.timestamp, commentId],

    // Increase the token's comment count
    ['INCRBY', `token:${comment.tokenId}:comments:count`, 1]
  ];
  
  const success = await runRedisTransaction(cmds);

  if (!success) {
    return false;
  }

  await addToZeplo(
    'api/actions/add',
    {
      action: ActionTypes.Commented,
      object: "comment",
      objectId: comment.id
    },
    req.cookies.refreshToken,
    req.cookies.accessToken
  );

  return true;
}

// This could be vulnerable to CSRF. To prevent this we are setting the auth cookies to LAX.
// https://portswigger.net/web-security/csrf/samesite-cookies
route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { comment, objectId, object, tokenId } = req.body;

  const isValid = await AddCommentValidationSchema.isValid(req.body)
  if (!isValid) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  // We trim the comment on both the client and server. 
  //
  // Yup's 'trim' validates the input IS a trimmed string every time the user types a character
  // Given we expect there to be spaces in a comment, it would be pretty annoying for the user 
  // to constantly get error messages like 'must be a trimmed string' as they type on the UI
  const hodlComment: HodlComment = {
    subject: req.address,
    comment: comment.trim(),
    object, // the comment's parent can be a token or a comment
    objectId,
    tokenId,
  };

  const success = await addComment(hodlComment, req);

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(500).json({ message: 'comment not added' });
  }
});


export default route;
