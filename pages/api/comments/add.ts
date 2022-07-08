import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

const client = Redis.fromEnv()
import apiRoute from "../handler";

import { HodlAction, ActionTypes } from "../../../models/HodlAction";
import { addAction } from "../notifications/add";
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
// The hash containing every comment made on HodlMyMoon
// "comment" -> {
//   1: "{ subject, comment, token, timestamp }", 
//   2: "{ subject, comment, token, timestamp }"
// }
//
// The sorted set of comments the user has made (on tokens or comments):
// "commented:0x1234" -> (<id>/<time>, <id>/<time>, <id>/<time>)
//
// The sorted set of comments made on a token:
// "comments:token:1" -> (<id>/<time>, <id>/<time>, <id>/<time>)
//
// The sorted set of comments made on a comment (i.e. replies)
// "comments:comment:1" -> (<id>/<time>, <id>/<time>, <id>/<time>)


export const addComment = async (comment: HodlComment) => {
  comment.timestamp = Date.now();

  // This should be in a transaction (multi/exec) but the rest api/upstash client doesn't support them
  // We are using the rest api as it handles concurrent connections better
  // https://docs.upstash.com/redis/features/restapi

  // It will not lead to data corruption, but there's always a chance we store a comment, but don't add the reference to the Sets
  const commentId = await client.incr("commentId")
  comment.id = commentId;

  // Store the comment
  const commentAdded = client.hset("comment", { [commentId]: JSON.stringify(comment) });

  // Store references to the comment for user, the token
  const userRecordAdded = await client.zadd(`commented:${comment.subject}`, { score: comment.timestamp, member: commentId });
  const tokenRecordAdded = await client.zadd(`comments:${comment.object}:${comment.objectId}`, { score: comment.timestamp, member: commentId });

  // update the comment count (comments on the nft and all the replies) for the token
  const commentCountUpdated = await client.zincrby("commentCount", 1, comment.tokenId);

  let notificationAdded = 0;
  if (tokenRecordAdded) {
    const notification: HodlAction = {
      subject: comment.subject,
      action: ActionTypes.CommentedOn,
      object: "comment",
      id: comment.id
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

  const hodlComment: HodlComment = {
    subject: req.address,
    comment,
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
