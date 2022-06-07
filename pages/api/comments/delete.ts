import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

import { getProvider } from "../../../lib/server/connections";
import { ethers } from "ethers";
import { nftaddress } from "../../../config";
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';

const client = Redis.fromEnv()
import apiRoute from "../handler";
import { HodlComment } from "../../../models/HodlComment";
import { getCommentCount } from "./count";
import { DeleteCommentValidationSchema } from "../../../validationSchema/comments/deleteComment";


dotenv.config({ path: '../.env' })
const route = apiRoute();

const removeComment = async (comment: HodlComment) => {
  console.log(JSON.stringify(comment))
  const result1 = await client.zrem(
    `commented:${comment.subject}`, JSON.stringify(comment)
  );

  const result2 = await client.zrem(
    `comments:${comment.token}`, JSON.stringify(comment)
  );

  getCommentCount.delete(comment.token);

  return result1 + result2;

  // TODO - Remove notification
}

// user can remove their own comment. 
// token owner can remove any comment on their token
route.delete(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { subject, comment, token, timestamp } = req.body;

  const isValid = await DeleteCommentValidationSchema.isValid(req.body)
  if (!isValid) {
      return res.status(400).json({ message: 'Bad Request' });
  }

  const provider = await getProvider();
  const contract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
  const tokenExists = await contract.exists(token);
  if (!tokenExists) {
    return res.status(400).json({ message: 'Bad Request' });
  }
  const owner = await contract.ownerOf(token);

  const notTokenOwner = req.address !== owner;
  const notMyComment = req.address !== subject;

  if (notMyComment && notTokenOwner) {
    return res.status(400).json({ message: 'Bad Request - You cannot delete this comment' });
  }

  const hodlComment: HodlComment = { subject, comment, token, timestamp };
  const success = await removeComment(hodlComment);

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(200).json({ message: 'comment not deleted' });
  }
});


export default route;
