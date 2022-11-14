
export const zRange = async (
  key: string,
  start: number | string,
  stop: number | string,
  { byScore = false, rev = false, offset = null, count = null, withScores = false }
) => {

  const url = `${process.env.UPSTASH_REDIS_REST_URL}/zrange/${key}/${start}/${stop}${byScore ? '/byscore' : ''}${rev ? '/rev' : ''}${offset || count ? `/limit/${offset}/${count}` : ''}${withScores ? '/withscores' : ''}`;

  const response = await fetch(
    url,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      },
      keepalive: true
    });

  const { result: ids } = await response.json();

  return ids;
}