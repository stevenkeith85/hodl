import { runRedisPipeline } from "./pipeline";
import { getUsers } from "./Users";

export const mGetComments = async (ids: string[]) => {
  if (ids.length === 0) {
    return [];
  }

  const args = ids.map(id => `comment:${id}`).join('/')

  try {
    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/mget/${args}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          Accept: 'application/json'
        },
        keepalive: true
      });


    const data = await r.json();

    let result = data?.result?.map(i => JSON.parse(i));

    return result || [];
  } catch (e) {
    console.log(e)
    return []
  }
}


export const getCommentVMs = async (ids: string[]) => {
  if (ids.length === 0) {
    return [];
  }

  // TODO: Probably can combine these two pipelines into one
  const repliesCmds = ids.map(id =>
    ['zcard', `comment:${id}:comments`],
  )
  const replyCountPromise = runRedisPipeline(repliesCmds);

  const likesCmds = ids.map(id =>
    ['zcard', `likes:comment:${id}`]
  )
  const likeCountPromise = runRedisPipeline(likesCmds);


  const commentsPromise = mGetComments(ids)

  const [replyCounts, likeCounts, comments] = await Promise.all([replyCountPromise, likeCountPromise, commentsPromise])

  const commentVMs = comments.map((comment, index) => {
    comment.replyCount = replyCounts[index];
    comment.likeCount = likeCounts[index]
    return comment;
  })

  const addresses: string[] = commentVMs?.map(comment => comment.subject);
  const uniqueAddresses = new Set(addresses);

  const userVMs = uniqueAddresses.size ? await getUsers(Array.from(uniqueAddresses)) : [];

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
    tokenId: comment.tokenId,
    replyCount: comment.replyCount,
    likeCount: comment.likeCount
  }));

  return result;
}