export const zCard = async (key: string) => {
    const response = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/zcard/${key}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      },
      keepalive: true
    });

  const { result: total } = await response.json();

  return total;
}