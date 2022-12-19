export const hmGet = async <Type extends Object>(key: string, ...fields: string[]) : Promise<Type> => {
  try {
    const r = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/HMGET/${key}/${fields.join('/')}`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      },
      keepalive: true
    });

    const data = await r.json();

    const result = fields.reduce((map, field, index) => {
      map[field] = data?.result?.[index];
      return map;
    }, {} as Type);

    return result;
  } catch (e) {
    console.log(e)
    return null;
  }
}
