import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

const client = Redis.fromEnv()
import apiRoute from "../handler";

import { HodlNotification, NftAction } from "../../../models/HodlNotifications";
import { addNotification } from "../notifications/add";
import { getCommentCount } from "./count";
import { CommentValidationSchema } from "../../../validationSchema/comments";
import { ethers } from "ethers";
import { nftaddress } from "../../../config";
import { getProvider } from "../../../lib/server/connections";
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { HodlComment } from "../../../models/HodlComment";

dotenv.config({ path: '../.env' })
const route = apiRoute();


export const addComment = async (comment: HodlComment) => {  
  comment.timestamp = Date.now();

  const userRecordAdded = await client.zadd(
    `commented:${comment.subject}`,
    {
      score: comment.timestamp,
      member: JSON.stringify(comment)
    }
  );

  const tokenRecordAdded = await client.zadd(
    `comments:${comment.token}`,
    {
      score: comment.timestamp,
      member: JSON.stringify(comment)
    }
  );

  let notificationAdded = 0;
  if (tokenRecordAdded) {
    const notification: HodlNotification = {
      subject: comment.subject,
      action: NftAction.CommentedOn,
      token: comment.token,
      timestamp: comment.timestamp
    };

    notificationAdded = await addNotification(notification);
  }

  getCommentCount.delete(comment.token);

  return [userRecordAdded, tokenRecordAdded, notificationAdded]
}


route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { comment, token } = req.body;

  if (!comment || !token) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const isValid = await CommentValidationSchema.isValid(req.body)
  if (!isValid) {
      return res.status(400).json({ message: 'Invalid data supplied' });
  }

  const provider = await getProvider();
  const contract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
  const tokenExists = await contract.exists(token);

  if (!tokenExists) { 
    return res.status(400).json({ message: 'Bad Request' });
  }

  const hodlComment: HodlComment = {
    subject: req.address,
    comment,
    token
  };

  const success = await addComment(hodlComment);

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(500).json({ message: 'comment not added' });
  }
});


export default route;
