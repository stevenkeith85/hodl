import { HodlComment } from "../../../models/HodlComment";
import { convertUnicode } from "../../utils";

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

    let comment = JSON.parse(result);
    comment.comment = convertUnicode(comment.comment); // convert unicode '\u1234' characters back to string

    return comment;
  }
  catch (e) {
    console.log(e);
    throw e;
  }
}

