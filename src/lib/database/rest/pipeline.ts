export const runRedisPipeline = async (cmds) => {
  try {
    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      },
      body: JSON.stringify(cmds),
      keepalive: true,
    }
    )

    const data = await r.json()

    return data.map(datum => datum?.result);
  } catch (e) {
    console.log('Upstash REDIS Pipeline error', e.message);
    return [];
  }
}
