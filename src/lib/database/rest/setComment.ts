import { HodlComment } from "../../../models/HodlComment";

export const setComment = async (id, comment: HodlComment) => {
  try {
    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/set/comment:${id}/${JSON.stringify(comment)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        }
      });

    return true;
  }
  catch (e) {
    console.log(e);
    throw e;
  }
}

