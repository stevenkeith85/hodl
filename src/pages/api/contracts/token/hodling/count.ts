import apiRoute from "../../../handler";
import { get } from "../../../../../lib/database/rest/get";

const route = apiRoute();

// TODO: This should never read from the blockchain, so that we get predictable response times for the UI
// This will allow us to offer a better experience for users
// Blockchain updates should happen async via the message queue
export const getHodlingCount = async (address): Promise<number> => {
  if (!address) {
    return null;
  }

  // Why we store 2 keys, rather than just a ZSET (and do a ZCARD to get the count)..

  // if hodlingCount (via a zcard lookup) was 0 then the set isn't present. (as REDIS does not allow empty sets)
  // that could mean its expired (and we'd need to recache it via the blockchain)...
  // 
  // if the user 'actually' is hodling 0 (when we read the blockchain) then we need a way of saying that (again -> redis doesn't allow empty sets)

  // if we can't say 'we checked but this user really does have nothing' then we'll effectively lose the ability to cache 'hodling 0 tokens'

  // so we've decided to have holding -> ZSET, AND hodlingCount -> number; and update them / expire them together

  // when we do a GET hodlingCount, we can differentiate between 0 (user has nothing) and null (the cache has expired); and then update both during the caching process

  // let hodlingCount = skipCache ? null : await client.get<number>(`user:${address}:hodlingCount`);
  let hodlingCount = await get(`user:${address}:hodlingCount`);

  if (hodlingCount === null) {
    // This won't really happen, but we've handled it in 'index'
    return 0;
  }

  return hodlingCount;
}

route.get(async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const count = await getHodlingCount(address);
  res.status(200).json(count);
});


export default route;
