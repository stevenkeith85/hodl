import { HodlComment } from "../../../models/HodlComment";

export const getComment = async (id): Promise<HodlComment | null> => {
  try {
    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/comment:${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        },
        keepalive: true
      });

    const { result } = await r.json();

    return JSON.parse(result);
  }
  catch (e) {
    console.log(e);
    throw e;
  }
}

