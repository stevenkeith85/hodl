import { HodlComment } from "../../../models/HodlComment";

export const getComment = async (id) : Promise<HodlComment | null> => {
  try {
    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/comment:${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        }
      });
  
    const {result: comment } = await r.json();
    
    return JSON.parse(comment);
    }
    catch(e) {
      console.log(e);
      throw e;
    }
}

