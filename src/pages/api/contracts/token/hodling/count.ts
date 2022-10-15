import dotenv from 'dotenv'
import apiRoute from "../../../handler";
import { ethers } from 'ethers';
import { getProvider } from '../../../../../lib/server/connections';
import HodlNFT from '../../../../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { Redis } from '@upstash/redis';
import { ScoreMember } from '@upstash/redis/types/pkg/commands/zadd';
import axios from 'axios';

dotenv.config({ path: '../.env' })

const route = apiRoute();
const client = Redis.fromEnv()

const addressToTokenIds = async (address, offset, limit) => {
  const provider = getProvider();
  const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, HodlNFT.abi, provider);
  const result = await tokenContract.addressToTokenIds(address, offset, limit);
  return result;
}

export const updateHodlingCache = async (address) => {

  try {
    console.log('updating hodling cache');

    await client.del(`user:${address}:hodling`);
    await client.del(`user:${address}:hodlingCount`);

    const offset = 0;
    const limit = 100;

    let score = 0;
    let scoreMemberPairs: number[] = [];

    // get first page
    let result = await addressToTokenIds(address, offset, limit);
    result.page.forEach(item => scoreMemberPairs.push(score++, Number(item)))
    

    // get remaining pages
    while (Number(result.next) < Number(result.total)) {
      result = await addressToTokenIds(address, Number(result.next), limit)
      result.page.forEach(item => scoreMemberPairs.push(score++, Number(item)))
    }

    let cmds = [];

    if (scoreMemberPairs.length) {
      cmds.push(
        ["ZADD", `user:${address}:hodling`, ...scoreMemberPairs],
      )
    }

    cmds = cmds.concat([
      ["SET", `user:${address}:hodlingCount`, (scoreMemberPairs.length / 2)],
      ["EXPIRE", `user:${address}:hodling`, 60],
      ["EXPIRE", `user:${address}:hodlingCount`, 60],
    ]);

    try {
      const r = await axios.post(
        `${process.env.UPSTASH_REDIS_REST_URL}/multi-exec`,
        cmds,
        {
          headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
          }
        })

      const response = r.data;

      if (response.error) {
        console.log('update hodling cache - redis add token transaction was discarded', response);
      }
    } catch (e) {
      console.log('update hodling cache - upstash rest api error', e)
    }
  }
  catch (e) {
    console.log('unable to update hodling cache')
  }
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
