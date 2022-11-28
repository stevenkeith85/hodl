import axios from 'axios'

// TODO: Switch to fetch
export const runRedisTransaction = async (cmds): Promise<boolean> => {
  try {
    const r = await axios.post(
      `${process.env.UPSTASH_REDIS_REST_URL}/multi-exec`,
      cmds,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          'Content-Type': 'application/json'
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

