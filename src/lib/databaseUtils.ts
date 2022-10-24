// util functions for upstash redis

import axios from 'axios';


export const trimZSet = async (client, set, MAX_SIZE = 500) => {
  // Only keep MAX_SIZE entries; as this is used on the UI and we want things to remain fast
  // We are also not sure about data storage costs at the moment
  await client.zremrangebyrank(
    set,
    0,
    -(MAX_SIZE + 1)
  );
}


export const runRedisTransaction = async (cmds): Promise<boolean> => {
  try {
    const r = await axios.post(
      `${process.env.UPSTASH_REDIS_REST_URL}/multi-exec`,
      cmds,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        }
      })

    const response = r.data;

    console.log('Upstash REDIS TX', response);
    
    if (response.error) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}
