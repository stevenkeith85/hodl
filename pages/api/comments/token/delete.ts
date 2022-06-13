import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

import { getProvider } from "../../../../lib/server/connections";
import { ethers } from "ethers";
import { nftaddress } from "../../../../config";
import HodlNFT from '../../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';

const client = Redis.fromEnv()
import apiRoute from "../../handler";
import { getCommentCount } from "./count";
import { DeleteCommentValidationSchema } from "../../../../validationSchema/comments/deleteComment";


dotenv.config({ path: '../.env' })
const route = apiRoute();

const removeComment = async (address, object, objectId, id) => {
  const commentDeleted = await client.hdel(`comment`, id);
  const userRecordDeleted = await client.zrem(`commented:${address}`, id);
  const tokenRecordDeleted = await client.zrem(`comments:${object}:${objectId}`, id);

  getCommentCount.delete(objectId);

  return commentDeleted + userRecordDeleted + tokenRecordDeleted;
}

// user can remove their own comment. 
// token owner can remove any comment on their token
route.delete(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { id, object, objectId, subject } = req.body; // We should look up the comment, as the user could just pass any 'subject' here

  const isValid = await DeleteCommentValidationSchema.isValid(req.body)
  if (!isValid) {
    return res.status(400).json({ message: 'Bad Request - yup' });
  }

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

  const success = await removeComment(subject, object, objectId, id);

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(200).json({ message: 'comment not deleted' });
  }
});


export default route;
