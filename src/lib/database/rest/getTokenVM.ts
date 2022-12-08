import { runRedisPipeline } from "./pipeline";


// This is optimised for getting one token vm.
// use getTokenVMs if you need to get multiple
export const getTokenVM = async (id: string) => {
  const cmds = [
    ['MGET', `token:${id}`, `token:${id}:comments:count`],
    ['ZCARD', `likes:token:${id}`]
  ];

  const [[tokenString, commentCount], likeCount] = await runRedisPipeline(cmds);
  
  const token = JSON.parse(tokenString);

  return {
    ...token,
    commentCount,
    likeCount
  }

}



