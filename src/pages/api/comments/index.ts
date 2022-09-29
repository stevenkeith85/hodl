import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

import apiRoute from "../handler";
import { GetCommentsValidationSchema } from "../../../validation/comments/getComments";
import { ethers } from "ethers";
import { nftaddress } from "../../../../config";
import { getProvider } from "../../../lib/server/connections";
import HodlNFT from '../../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { HodlCommentViewModel } from "../../../models/HodlComment";
import { getComment } from "../comment";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv();

const route = apiRoute();

const commentIdToViewModel = async (id): Promise<HodlCommentViewModel | null> => {
  const comment: HodlCommentViewModel = await getComment(id);

  if (!comment) {
    return null;
  }

  return comment;
}

export const getCommentsForToken = async (object: "token" | "comment", objectId: number, offset: number, limit: number, reverse = false) => {

  try {
    const total = await client.zcard(`${object}:${objectId}:comments`);

    // ZRANGE: Out of range indexes do not produce an error.
    // So we need to check here and return if we are about to do an out of range search
    if (offset >= total) {
      return { 
        items: [], 
        next: Number(offset) + Number(limit),
        total: Number(total) 
      };
    }

    const start = offset;
    const stop = offset + limit - 1;

    const commentIds : string [] = await client.zrange(`${object}:${objectId}:comments`, start, stop, { rev: reverse });
    const promises = commentIds.map(id => commentIdToViewModel(id));
    const comments: HodlCommentViewModel[] = await Promise.all(promises);

    return { 
      items: comments, 
      next: Number(offset) + Number(limit), 
      total: Number(total) 
    };
  } catch (e) {
    return { 
      items: [], 
      next: 1, 
      total: 0 
    };
  }
}

route.get(async (req, res: NextApiResponse) => {
  const object = Array.isArray(req.query.object) ? req.query.object[0] : req.query.object;
  const objectId = Array.isArray(req.query.objectId) ? req.query.objectId[0] : req.query.objectId;
  const offset = Array.isArray(req.query.offset) ? req.query.offset[0] : req.query.offset;
  const limit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
  const rev = (Array.isArray(req.query.rev) ? req.query.rev[0] : req.query.rev) || "false";

  const isValid = await GetCommentsValidationSchema.isValid(req.query)
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

  const comments = await getCommentsForToken(object as "comment" | "token", Number(objectId), Number(offset), Number(limit), JSON.parse(rev));
  res.status(200).json(comments);
});


export default route;
