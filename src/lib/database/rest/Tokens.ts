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


export const getTokenVMs = async (tokenIds: string[]) => {
  if (tokenIds.length === 0) {
    return [];
  }

  const cmds = tokenIds.map(id => ['zcard', `likes:token:${id}`])

  const likeCountsPromise = runRedisPipeline(cmds);
  const commentCountsPromise = mGetTokensCommentCounts(tokenIds);
  const tokensPromise = mGetTokens(tokenIds);
  

  const [likeCounts, commentCounts, tokens] = await Promise.all([likeCountsPromise, commentCountsPromise, tokensPromise])

  tokens.map((token, index) => {
    token.likeCount = likeCounts[index];
    token.commentCount = commentCounts[index];
    return token
  })

  return tokens;

}
