import { chunk } from "../../lodash";
import { runRedisPipeline } from "./databaseUtils";


export const mGetTokens = async (tokenIds: string[]) => {
  try {
    const tokenArgs = tokenIds.map(id => `token:${id}`).join('/')
    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/mget/${tokenArgs}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        }
      });

    const data = await r.json();

    return data?.result?.map(item => JSON.parse(item));
  } catch (e) {
    console.log(e)
  }
}

export const mGetTokensCommentCounts = async (tokenIds: string[]) => {
  try {
    const args = tokenIds.map(id => `token:${id}:comments:count`).join('/')

    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/mget/${args}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        }
      });

    const data = await r.json();

    return data?.result?.map(item => JSON.parse(item));
  } catch (e) {
    console.log(e)
  }
}

export const mGetTokenAndCommentCount = async (tokenIds: string[]) => {
  try {
    const tokenAndComments = tokenIds.map(id => `token:${id}/token:${id}:comments:count`).join('/')

    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/mget/${tokenAndComments}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        },
        keepalive: true
      });

    const data = await r.json();

    return data?.result?.map(item => JSON.parse(item));
  } catch (e) {
    console.log(e)
  }
}

export const getTokenVMs = async (tokenIds: string[]) => {
  // const start = Date.now();

  if (tokenIds.length === 0) {
    return [];
  }

  const cmds = tokenIds.map(id => ['zcard', `likes:token:${id}`])

  const likeCountsPromise = runRedisPipeline(cmds);
  const tokenAndCommentCountPromise = mGetTokenAndCommentCount(tokenIds)
  
  const [likeCounts, tokenAndCommentCount] = await Promise.all([likeCountsPromise, tokenAndCommentCountPromise])

  const tokens = chunk(tokenAndCommentCount, 2);

  // console.log('tokens', tokens);
  const result = tokens.map(([token, commentCount], index) => {
    token.likeCount = likeCounts[index];
    token.commentCount = commentCount;
    return token
  })

  // const stop = Date.now();
  // console.log('get token vms', stop - start);

  return result;
}
