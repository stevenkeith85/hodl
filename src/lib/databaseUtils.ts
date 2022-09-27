// util functions for upstash redis

export const trimZSet = async (client, set, MAX_SIZE=5) => {
    // Only keep MAX_SIZE entries; as this is used on the UI and we want things to remain fast
    // We are also not sure about data storage costs at the moment
    await client.zremrangebyrank(
      set,
      0, 
      -(MAX_SIZE + 1)
    );
  }