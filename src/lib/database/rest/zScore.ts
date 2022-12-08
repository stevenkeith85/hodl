export const zScore = async (key: string, member: string) => {
    const response = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/zscore/${key}/${member}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      },
      keepalive: true
    });

  const { result: score } = await response.json();

  return score;
}
