import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

import { getProvider } from "../../../lib/server/connections";
import { ethers } from "ethers";
import { nftaddress } from "../../../config";
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';

const client = Redis.fromEnv()
import apiRoute from "../handler";
import { getCommentCount } from "./count";
import { DeleteCommentValidationSchema } from "../../../validationSchema/comments/deleteComment";
import { HodlComment } from "../../../models/HodlComment";


dotenv.config({ path: '../.env' })
const route = apiRoute();

const removeComment = async (address, object, objectId, id, tokenId) => {
  const replies = await client.zcard(`comments:${object}:${id}`);

  if (!replies) {
    const commentDeleted = await client.hdel(`comment`, id);
    const userRecordDeleted = await client.zrem(`commented:${address}`, id);
    const tokenRecordDeleted = await client.zrem(`comments:${object}:${objectId}`, id);

    const commentCountUpdated = await client.zincrby("commentCount", -1, tokenId);

    // these may be the same
    // getCommentCount.delete(objectId);
    // getCommentCount.delete(tokenId);

    return commentDeleted + userRecordDeleted + tokenRecordDeleted;
  }

  return 0;

}

// user can remove their own comment. 
// token owner can remove any comment on their token
route.delete(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { id } = req.body;

  const isValid = await DeleteCommentValidationSchema.isValid(req.body)
  if (!isValid) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const comment = await client.hget('comment', id);

  if (!comment) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const { object, objectId, subject, tokenId } = comment as HodlComment;

  if (object === "token") {
    const provider = await getProvider();
    const contract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
    const tokenExists = await contract.exists(objectId);

    if (!tokenExists) {
      return res.status(400).json({ message: 'Bad Request - blockchain' });
    }

    const owner = await contract.ownerOf(objectId);

    const notTokenOwner = req.address !== owner;
    const notMyComment = req.address !== subject;

    if (notMyComment && notTokenOwner) {
      return res.status(400).json({ message: 'Bad Request - You cannot delete this comment' });
    }
  } else if (object === "comment") {
    const notMyComment = req.address !== subject;

    if (notMyComment) {
      return res.status(400).json({ message: 'Bad Request - You cannot delete this comment' });
    }
  }

  const success = await removeComment(subject, object, objectId, id, tokenId);

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(200).json({ message: 'comment not deleted' });
  }
});


export default route;
