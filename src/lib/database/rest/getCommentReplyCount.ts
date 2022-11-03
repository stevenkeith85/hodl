
export const getCommentReplyCount = async (id) : Promise<number> => {
  try {
    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/zcard/comment:${id}:comments`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        }
      });
  
    const {result: count } = await r.json();
    
    return JSON.parse(count);
    }
    catch(e) {
      console.log(e);
      throw e;
    }
}

