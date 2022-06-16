import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

const client = Redis.fromEnv()
import apiRoute from "../handler";

import { HodlNotification, NftAction } from "../../../models/HodlNotifications";
import { addNotification } from "../notifications/add";
import { getCommentCount } from "./count";
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
// "comment" -> {
//   1: "{ subject, comment, token, timestamp }", 
//   2: "{ subject, comment, token, timestamp }"
// }
//
// "commented:0x1234" -> (1, 2, 3)
// "comments:token:1" -> (0x1234, 0x5678)


export const addComment = async (comment: HodlComment) => {
  comment.timestamp = Date.now();

  // This should be in a transaction (multi/exec) but the rest api/upstash client doesn't support them
  // We are using the rest api as it handles concurrent connections better
  // https://docs.upstash.com/redis/features/restapi

  // It will not lead to data corruption, but there's always a chance we store a comment, but don't add the reference to the Sets
  const commentId = await client.incr("commentId")
  comment.id = commentId;

  const commentAdded = client.hset("comment", { [commentId]: JSON.stringify(comment) });

  const userRecordAdded = await client.zadd(`commented:${comment.subject}`, { score: comment.timestamp, member: commentId });

  const tokenRecordAdded = await client.zadd(`comments:${comment.object}:${comment.objectId}`, { score: comment.timestamp, member: commentId });

  let notificationAdded = 0;
  if (tokenRecordAdded) {
    const notification: HodlNotification = {
      subject: comment.subject,
      action: NftAction.CommentedOn,
      token: comment.objectId,
      comment: comment.id
    };

    notificationAdded = await addNotification(notification);
  }

  getCommentCount.delete(comment.objectId);

  return [commentAdded, userRecordAdded, tokenRecordAdded, notificationAdded]
}


route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { comment, id, object } = req.body;

  const isValid = await AddCommentValidationSchema.isValid(req.body)
  if (!isValid) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  if (object === "token") {
    const provider = await getProvider();
    const contract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
    const tokenExists = await contract.exists(id);

    if (!tokenExists) {
      return res.status(400).json({ message: 'Bad Request' });
    }
  }

  const hodlComment: HodlComment = {
    subject: req.address,
    comment,
    object,
    objectId: id
  };

  const success = await addComment(hodlComment);

  if (success) {
    getCommentCount.delete(object, id);
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(500).json({ message: 'comment not added' });
  }
});


export default route;
