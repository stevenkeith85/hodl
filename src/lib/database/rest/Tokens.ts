export const mGetTokens = async (tokenIds: string[]) => {
    if (tokenIds.length === 0) {
        return [];
    }

    const tokenArgs = tokenIds.map(id => `token:${id}`).join('/')
    

    try {
        const r = await fetch(
          `${process.env.UPSTASH_REDIS_REST_URL}/mget/${tokenArgs}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
            }
          });
                  
          const data = await r.json();

          const tokens = data?.result?.map(item => JSON.parse(item));
          return tokens || [];
      } catch (e) {
        console.log(e)
      }
}
