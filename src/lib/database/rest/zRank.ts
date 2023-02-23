export const zRank = async (key: string, value: string) => {
    const response = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/zrank/${key}/${value}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      },
      keepalive: true
    });

  const { result } = await response.json();

  return result;
}
