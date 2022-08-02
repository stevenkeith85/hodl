import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

const client = Redis.fromEnv()
import apiRoute from "../handler";

import { HodlAction, ActionTypes } from "../../../models/HodlAction";
import { addAction } from "../actions/add";
import { AddCommentValidationSchema } from "../../../validationSchema/comments/addComments";
import { ethers } from "ethers";
import { nftaddress } from "../../../config";
import { getProvider } from "../../../lib/server/connections";
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { HodlComment } from "../../../models/HodlComment";

dotenv.config({ path: '../.env' })
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


export const addComment = async (comment: HodlComment) => {
  comment.timestamp = Date.now();

  // TODO: REDIS TRANSACTION
  const commentId = await client.incr("commentId")
  comment.id = commentId;

  // Store the comment
  // const commentAdded = client.hset("comment", { [commentId]: JSON.stringify(comment) });
  const commentAdded = client.set(`comment:${commentId}`, comment);

  // Store references to the comment for user, the token
  // const userRecordAdded = await client.zadd(`commented:${comment.subject}`, { score: comment.timestamp, member: commentId });
  const userRecordAdded = await client.zadd(`user:${comment.subject}:comments`, { 
    member: commentId, 
    score: comment.timestamp 
  });

  // const tokenRecordAdded = await client.zadd(`comments:${comment.object}:${comment.objectId}`, { score: comment.timestamp, member: commentId });
  
  // add the comment to to token or comment's collection
  const tokenRecordAdded = await client.zadd(`${comment.object}:${comment.objectId}:comments`, { 
    member: commentId,
    score: comment.timestamp
  });
  
  // update the comment count (comments on the nft and all the replies) for the token
  // const commentCountUpdated = await client.zincrby("commentCount", 1, comment.tokenId);
  const commentCountUpdated = await client.incrby(`token:${comment.tokenId}:comments:count`, 1);

  let notificationAdded = 0;
  if (tokenRecordAdded) {
    const notification: HodlAction = {
      subject: comment.subject,
      action: ActionTypes.CommentedOn,
      object: "comment",
      objectId: comment.id
    };

    notificationAdded = await addAction(notification);
  }

  // getCommentCount.delete(comment.objectId);

  return [commentAdded, userRecordAdded, tokenRecordAdded, commentCountUpdated, notificationAdded]
}


route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { comment, objectId, object, tokenId } = req.body;

  const isValid = await AddCommentValidationSchema.isValid(req.body)
  if (!isValid) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  if (object === "token") {
    const provider = await getProvider();
    const contract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
    const tokenExists = await contract.exists(objectId);

    if (!tokenExists) {
      return res.status(400).json({ message: 'Bad Request' });
    }
  }

  // We trim the comment on both the client and server. 
  //
  // Yup's 'trim' validates the input IS a trimmed string every time the user types a character
  // Given we expect there to be spaces in a comment, it would be pretty annoying for the user 
  // to constantly get error messages like 'must be a trimmed string' as they type on the UI
  const hodlComment: HodlComment = {
    subject: req.address,
    comment: comment.trim(), 
    object,
    objectId,
    tokenId,
  };

  const success = await addComment(hodlComment);

  if (success) {
    // getCommentCount.delete(object, objectId);
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(500).json({ message: 'comment not added' });
  }
});


export default route;
