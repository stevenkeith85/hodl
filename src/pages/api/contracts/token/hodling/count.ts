import apiRoute from "../../../handler";
import { Contract } from '@ethersproject/contracts'
import { getProvider } from '../../../../../lib/server/connections';
import HodlNFT from '../../../../../../smart-contracts/artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { Redis } from '@upstash/redis';
import { runRedisTransaction } from '../../../../../lib/databaseUtils';

const route = apiRoute();
const client = Redis.fromEnv()

const addressToTokenIds = async (address, offset, limit) => {
  const provider = getProvider();
  const tokenContract = new Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, HodlNFT.abi, provider);
  const result = await tokenContract.addressToTokenIds(address, offset, limit);
  return result;
}

// If a user mints or trades on the market; we'll recache.
  //
  // If no-one has requested a hodling count or list in a while, then the cached data will disappear from redis
  // which will keep our storage costs down
  //
  // TODO: We might listed to generic transfer events in future 
  // in case stuff happens off-site. (user adds token to another market, etc)
  // This would allow us to cache for longer periods, as we'd be more sure of things
export const updateHodlingCache = async (address) => {
  const timeToCache = 60 * 30;

  console.log('updating hodling cache');
  const start = Date.now();

  const cmds = [
    ['DEL', `user:${address}:hodling`, `user:${address}:hodlingCount`]
  ];

  const offset = 0;
  const limit = 100;

  let score = 0;
  let scoreMemberPairs = [];

  // get first page
  let result = await addressToTokenIds(address, offset, limit);
  result.page.forEach(item => scoreMemberPairs.push(score++, Number(item)))

  // get remaining pages
  while (Number(result.next) < Number(result.total)) {
    result = await addressToTokenIds(address, Number(result.next), limit)
    result.page.forEach(item => scoreMemberPairs.push(score++, Number(item)))
  }

  if (scoreMemberPairs.length) {
    cmds.push(
      ["ZADD", `user:${address}:hodling`, ...scoreMemberPairs],
    )
  }

  cmds.push(
    ["SET", `user:${address}:hodlingCount`, `${scoreMemberPairs.length / 2}`],
    ["EXPIRE", `user:${address}:hodling`, `${timeToCache}`],
    ["EXPIRE", `user:${address}:hodlingCount`, `${timeToCache}`],
  );

  const success = await runRedisTransaction(cmds);

  const stop = Date.now();
  console.log('updateHodlingCache time taken', stop - start);
}

export const getHodlingCount = async (address, skipCache = false): Promise<number> => {
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

  let hodlingCount = skipCache ? null : await client.get<number>(`user:${address}:hodlingCount`);

  if (hodlingCount === null) { // repopulate the cache  
    await updateHodlingCache(address);
    hodlingCount = await client.get<number>(`user:${address}:hodlingCount`);
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
