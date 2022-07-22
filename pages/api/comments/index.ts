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

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

export const getCommentsForToken = async (object: "token" | "comment", objectId: number, offset: number, limit: number) => {

  try {
    const total = await client.zcard(`${object}:${objectId}:comments`);

    if (offset >= total) {
      return { items: [], next: Number(total), total: Number(total) };
    }

    const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/${object}:${objectId}:comments/${offset}/${offset + limit - 1}/rev`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    })
    const commentIds = r.data.result.map(item => JSON.parse(item));

    const comments = [];
    for (const id of commentIds) {
      comments.push(await client.get(`comment:${id}`));
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

  const comments = await getCommentsForToken(object as "comment" | "token", Number(objectId), Number(offset), Number(limit));
  res.status(200).json(comments);
});


export default route;
