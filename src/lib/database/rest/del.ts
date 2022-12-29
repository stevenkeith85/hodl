export const del = async (key) => {
  try {
    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/del/${key}`,
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
