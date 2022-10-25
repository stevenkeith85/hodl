import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';

import { getProvider } from "../../../lib/server/connections";
import { Contract } from '@ethersproject/contracts'
import HodlNFT from '../../../../smart-contracts/artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import HodlMarket from '../../../../smart-contracts/artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import apiRoute from "../handler";
import { DeleteCommentValidationSchema } from "../../../validation/comments/deleteComment";
import { HodlComment } from "../../../models/HodlComment";

const client = Redis.fromEnv()

const route = apiRoute();

// if a token has replies, we just change the text to "[deleted]", so that the replies still have an anchor
const removeComment = async (address, object, objectId, id, tokenId) => {

  const replies = await client.zcard(`comment:${id}:comments`);

  if (!replies) {
    const commentDeleted = await client.del(`comment:${id}`);
    const userRecordDeleted = await client.zrem(`user:${address}:comments`, id);
    const tokenRecordDeleted = await client.zrem(`${object}:${objectId}:comments`, id);

    // We always decrement the token id's comment count; as this represents the number of top level and sub level comments
    const commentCountUpdated = await client.incrby(`token:${tokenId}:comments:count`, -1);

    return commentDeleted + userRecordDeleted + tokenRecordDeleted + commentCountUpdated;
  } else {
    const comment: HodlComment = await client.get(`comment:${id}`);
    comment.comment = "[deleted]";

    const commentUpdated = await client.set(`comment:${id}`, comment);
    return commentUpdated;
  }
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

  const comment = await client.get(`comment:${id}`);

  if (!comment) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const { object, objectId, subject, tokenId } = comment as HodlComment;

  const provider = await getProvider();
  const contract = new Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, HodlNFT.abi, provider);
  const tokenExists = await contract.exists(tokenId);

  if (!tokenExists) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const owner = await contract.ownerOf(tokenId);

  const marketContract = new Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, HodlMarket.abi, provider);
  const marketItem = await marketContract.getListing(tokenId);
  const seller = marketItem.seller;

  const notTokenOwner = req.address !== owner && req.address !== seller;
  const notMyComment = req.address !== subject;

  if (notMyComment && notTokenOwner) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  console.log(subject, object, objectId, id, tokenId)
  const success = await removeComment(subject, object, objectId, id, tokenId);

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(200).json({ message: 'comment not deleted' });
  }
});


export default route;
