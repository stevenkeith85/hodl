import { Redis } from '@upstash/redis';

const client = Redis.fromEnv()

// TODO: this should just be inlined into the call sites; and then deleted
export const getTagsForToken = async token => {
  const tags = await client.smembers(`token:${token}:tags`); // O(n) but n can only be 6 items or less
  console.log('tags/index/getTagsForToken - tags ===', tags);
  return tags;
}
