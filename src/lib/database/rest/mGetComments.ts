import { convertUnicode } from "../../utils";

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
          Accept: 'application/json;charset=utf-8'
        },
        keepalive: true
      });


    const data = await r.json();

    let result = data?.result?.map(i => JSON.parse(i));
    
    result = result.map(comment => {
      comment.comment = convertUnicode(comment.comment); // convert unicode '\u1234' characters back to string
      return comment;
    })
    

    return result || [];
  } catch (e) {
    console.log(e)
    return []
  }
}
