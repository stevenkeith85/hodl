export const set = async (key, value) => {
  try {
    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/set/${key}/${value}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        },
        keepalive: true
      });

    const { result } = await r.json();

    return result;
  } catch (e) {
    console.log(e)
  }
}
