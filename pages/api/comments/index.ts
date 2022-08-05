import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import axios from 'axios';

import apiRoute from "../handler";
import { GetCommentsValidationSchema } from "../../../validationSchema/comments/getComments";
import { ethers } from "ethers";
import { nftaddress } from "../../../config";
import { getProvider } from "../../../lib/server/connections";
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { getUser } from "../user/[handle]";
import { HodlComment, HodlCommentViewModel } from "../../../models/HodlComment";
import { getToken } from "../token/[tokenId]";
import { fetchNFT } from "../nft/[tokenId]";
import { getCommentLikeCount } from "../like/comment/count";
import { getComment } from "../comment";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getCommentsForToken = async (object: "token" | "comment", objectId: number, offset: number, limit: number, reverse = false) => {

  try {
    const total = await client.zcard(`${object}:${objectId}:comments`);

    if (offset >= total) {
      return { items: [], next: Number(total), total: Number(total) };
    }

    console.log(reverse)
    let url = `${process.env.UPSTASH_REDIS_REST_URL}/zrange/${object}:${objectId}:comments/${offset}/${offset + limit - 1}/`;
    url = reverse ? url + 'rev': url

    const r = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    })
    const commentIds = r.data.result.map(item => JSON.parse(item));

    const comments: HodlCommentViewModel[] = [];

    for (const id of commentIds) {
      const comment: HodlCommentViewModel = await getComment(id);

      if (comment) {
        comments.push(comment);
      }
    }

    return { items: comments, next: Number(offset) + Number(comments.length), total: Number(total) };
  } catch (e) {
    return { items: [], next: 0, total: 0 };
  }
}

route.get(async (req, res: NextApiResponse) => {
  const object = Array.isArray(req.query.object) ? req.query.object[0] : req.query.object;
  const objectId = Array.isArray(req.query.objectId) ? req.query.objectId[0] : req.query.objectId;
  const offset = Array.isArray(req.query.offset) ? req.query.offset[0] : req.query.offset;
  const limit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
  const rev = (Array.isArray(req.query.rev) ? req.query.rev[0] : req.query.rev) || "false";

  console.log('rev', rev)
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
