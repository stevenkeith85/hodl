// TODO: refactor to use MGET to save cmds
export const getTokens = async (tokenIds: string[]) => {
    const cmds = [];

    for (let tokenId of tokenIds) {
        cmds.push(['GET', 'token:' + tokenId]);
    }

    if (cmds.length === 0) {
        return [];
    }

    try {
        const r = await fetch(
          `${process.env.UPSTASH_REDIS_REST_URL}/pipeline`,
          {
            method: 'POST',
            body: JSON.stringify(cmds),
            headers: {
              Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
            }
          });
                  
          const data = await r.json();
          
          const tokens = data.map(item => JSON.parse(item.result));
          return tokens;
      } catch (e) {
        console.log(e)
      }
}
