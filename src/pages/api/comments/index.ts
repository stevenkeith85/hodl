import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import { GetCommentsValidationSchema } from "../../../validation/comments/getComments";
import { HodlComment, HodlCommentViewModel } from "../../../models/HodlComment";
import { getComment } from "../comment";
import { User, UserViewModel } from "../../../models/User";
import { getUser } from "../user/[handle]";
import { Token } from "../../../models/Token";

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
    // const start = new Date();

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

    const commentIds: string[] = await client.zrange(`${object}:${objectId}:comments`, offset, offset + limit - 1, { rev: reverse });

    
    // We get all the comment data with one round trip to redis
    const commentPipeline = client.pipeline();
    for (let id of commentIds) {
      commentPipeline.get(`comment:${id}`);
    }
    const comments: HodlComment[] = commentIds?.length ? await commentPipeline.exec() : [];

    // Each comment has a subject. This is the address of the user who made the comment.
    // We get all the unique user objects from redis in one trip.
    const addresses: string[] = comments.map(comment => comment.subject);
    const uniqueAddresses = new Set(addresses);

    const userPipeline = client.pipeline();
    for (let address of Array.from(uniqueAddresses)) {
      userPipeline.hmget<User>(`user:${address}`, 'address', 'nickname', 'avatar');
    }

    const users: User[] = uniqueAddresses.size ? await userPipeline.exec() : [];

    
    // Each user object has a numeric id for their avatar. This represents a token.
    // We get those tokens in one round trip to redis
    const avatarIds: number[] = users.filter(user => user.avatar).map(user => user.avatar); // not everyone has an avatar

    const avatarPipeline = client.pipeline();
    for (let id of avatarIds) {
      avatarPipeline.get<Token>(`token:${id}`);
    }

    console.log('here');
    const avatars: Token[] = avatarIds.length ? await avatarPipeline.exec() : [];

    
    // Create an id to token map so that we can extrapolate the user info for the UI
    const avatarMap = avatars.reduce((map, token) => {
      map[token.id] = token;
      return map;
    }, {});

    const userVMs: UserViewModel[] = users.map(user => ({
      address: user.address,
      nickname: user.nickname,
      avatar: avatarMap[user.avatar]
    }))

    console.log('userVMs', userVMs);

    // Create an address to user map so that we can extrapolate the comment info for the UI
    const userMap = userVMs.reduce((map, user) => {
      map[user.address] = user;
      return map;
    }, {});

    // The final result we'll give back to the FE
    const result = comments.map(comment => ({
      id: comment.id,
      user: userMap[comment.subject],
      comment: comment.comment,
      timestamp: comment.timestamp,
      object: comment.object,
      tokenId: comment.tokenId
    }));
    
    
    // const stop = new Date();
    // console.log('time taken', stop - start);

    return {
      items: result,
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

  const comments = await getCommentsForToken(object as "comment" | "token", Number(objectId), Number(offset), Number(limit), JSON.parse(rev));
  res.status(200).json(comments);
});


export default route;
