export const getToken = async (id) => {
  if (!id) {
    return null;
  }

  try {
    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/token:${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        }
      });

    const { result: token } = await r.json();

    return JSON.parse(token);
  } catch (e) {
    console.log(e)
  }
}
