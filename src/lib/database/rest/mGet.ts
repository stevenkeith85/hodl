export const mGet = async (...keys: string[]): Promise<string[]> => {

  if (keys.length === 0) {
    return [];
  }

  try {
    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/mget/${keys.join('/')}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        },
        keepalive: true
      });

    const data = await r.json();

    return data?.result;
  } catch (e) {
    console.log(e)
  }
}