import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import memoize from 'memoizee';
import axios from 'axios';
const client = Redis.fromEnv()
import apiRoute from "../../handler";
import { GetCommentsValidationSchema } from "../../../../validationSchema/comments/getComments";
import { ethers } from "ethers";
import { nftaddress } from "../../../../config";
import { getProvider } from "../../../../lib/server/connections";
import HodlNFT from '../../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';

dotenv.config({ path: '../.env' })
const route = apiRoute();

export const getCommentsForToken = async (token: number, offset: number, limit: number) => {
  try {
    const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/comments:token:${token}/${offset}/${offset + limit - 1}/rev`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    })
    const commentIds = r.data.result.map(item => JSON.parse(item));
    console.log('commentIds', commentIds);

    const comments = [];
    for (const id of commentIds) {
      comments.push(await client.hget(`comment`, id));
    }

    const total = await client.zcard(`comments:token:${token}`);
    return { items: comments, next: Number(offset) + Number(comments.length), total: Number(total) };
  } catch (e) {
    return { items: [], next: 0, total: 0 };
  }
}

route.get(async (req, res: NextApiResponse) => {
  const token = Array.isArray(req.query.id) ? req.query.token[0] : req.query.id;
  const offset = Array.isArray(req.query.offset) ? req.query.offset[0] : req.query.offset;
  const limit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;

  const isValid = await GetCommentsValidationSchema.isValid(req.query)
  if (!isValid) {
      return res.status(400).json({ message: 'Bad Request' });
  }

  const provider = await getProvider();
  const contract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
  const tokenExists = await contract.exists(token);

  if (!tokenExists) { 
    return res.status(400).json({ message: 'Bad Request' });
  }

  const comments = await getCommentsForToken(Number(token), Number(offset), Number(limit));
  res.status(200).json(comments);
});


export default route;
