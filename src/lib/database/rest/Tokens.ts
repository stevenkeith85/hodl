import { chunk } from "../../lodash";
import { runRedisPipeline } from "./pipeline";


export const mGetTokens = async (tokenIds: string[]) => {
  try {
    const tokenArgs = tokenIds.map(id => `token:${id}`).join('/')
    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/mget/${tokenArgs}`,
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

// This is optimed to return only the data required for the explore page
// TODO: Maybe we look at using GraphQL; or make mGetTokens accept a list of fields to return
export const mGetTokensExplore = async (tokenIds: string[]) => {
  try {
    const tokenArgs = tokenIds.map(id => `token:${id}`).join('/')
    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/mget/${tokenArgs}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        },
        keepalive: true
      });

    const data = await r.json();

    return data?.result?.map(item => {
      const token = JSON.parse(item);

      return {
        id: token.id,
        image: token.image,
        properties: {
          ...token.properties
        }
      }
    });
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
        },
        keepalive: true
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


// TODO: Possibly might be able to further optimise this
export const getTokenVMs = async (tokenIds: any[]) => {
  if (tokenIds.length === 0) {
    return [];
  }

  // for each token get the count of addresses that like it
  const cmds = tokenIds.map(id => ['zcard', `likes:token:${id}`])
  const likeCountsPromise = runRedisPipeline(cmds);

  const tokenAndCommentCountPromise = mGetTokenAndCommentCount(tokenIds)

  const [likeCounts, tokenAndCommentCount] = await Promise.all([likeCountsPromise, tokenAndCommentCountPromise])

  const tokens = chunk(tokenAndCommentCount, 2);

  const result = tokens.map(([token, commentCount], index) => {
    token.likeCount = likeCounts[index];
    token.commentCount = commentCount || 0;
    return token
  })

  return result;
}
