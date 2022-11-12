export const mGetActions = async (actionIds: string[]) => {
    if (actionIds.length === 0) {
        return [];
    }

    const args = actionIds.map(id => `action:${id}`).join('/')
    
    try {
        const r = await fetch(
          `${process.env.UPSTASH_REDIS_REST_URL}/mget/${args}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
            },
            keepalive: true
          });
                  
          const data = await r.json();

          const result = data?.result?.map(item => JSON.parse(item));
          return result || [];
      } catch (e) {
        console.log(e)
      }
}
