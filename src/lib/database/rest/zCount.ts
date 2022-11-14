export const zCount = async (key: string, min, max) => {
    const response = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/zcount/${key}/${min}/${max}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      },
      keepalive: true
    });

  const { result: total } = await response.json();

  return total;
}