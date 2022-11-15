export const get = async (key) => {
  if (!key) {
    return null;
  }

  try {
    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/${key}`,
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
