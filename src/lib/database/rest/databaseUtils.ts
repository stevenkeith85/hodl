import axios from 'axios';

// TODO: Switch to fetch
export const runRedisTransaction = async (cmds): Promise<boolean> => {
  try {
    const r = await axios.post(
      `${process.env.UPSTASH_REDIS_REST_URL}/multi-exec`,
      cmds,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        },
      })

    const response = r.data;

    if (response.error) {
      console.log('Upstash REDIS TX response error', response);
      return false;
    }

    return true;
  } catch (e) {
    console.log('Upstash REDIS TX error', e.message);
    return false;
  }
}

export const runRedisPipeline = async (cmds) => {
  try {
    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      },
      body: JSON.stringify(cmds),
      keepalive: true,
    }
    )

    const data = await r.json()

    return data.map(datum => datum?.result);
  } catch (e) {
    console.log('Upstash REDIS Pipeline error', e.message);
    return false;
  }
}
