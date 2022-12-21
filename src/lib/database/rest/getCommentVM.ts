import { getUser } from "./getUser";
import { runRedisPipeline } from "./pipeline";

// This is optimised for getting one comment vm.
// use getCommentVMs if you need to get multiple
export const getCommentVM = async (id, viewer=null) => {
  const cmds = [
    ['GET', `comment:${id}`],
    ['ZCARD', `comment:${id}:comments`],
    ['ZCARD', `likes:comment:${id}`],
  ];

  const [commentString, replyCount, likeCount] = await runRedisPipeline(cmds);
  
  const comment = JSON.parse(commentString);

  const user = await getUser(comment.subject, viewer);

  return {
    id: comment.id,
    user,
    comment: comment.comment,
    timestamp: comment.timestamp,
    object: comment.object,
    objectId: comment.objectId,
    tokenId: comment.tokenId,
    replyCount: replyCount,
    likeCount: likeCount
  }
}
