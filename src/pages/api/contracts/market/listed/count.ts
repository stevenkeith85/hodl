import apiRoute from "../../../handler";

import { Contract } from '@ethersproject/contracts'
import { formatEther } from '@ethersproject/units'

import { getProvider } from '../../../../../lib/server/connections';
import HodlMarket from '../../../../../../smart-contracts/artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import { Redis } from '@upstash/redis';
import { runRedisTransaction } from '../../../../../lib/database/rest/databaseUtils';


const route = apiRoute();
const client = Redis.fromEnv()

const addressToListings = async (address, offset, limit) => {
  const provider = await getProvider();
  const market = new Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, HodlMarket.abi, provider);
  const result = await market.getListingsForAddress(address, offset, limit);
  return result;
}

export const updateListedCache = async (address) => {
  const timeToCache = 60 * 60 * 12; // cache for twelve hours

  // console.log('updating listed cache');
  // const start = Date.now();

  const cmds = [
    ['DEL', `user:${address}:listed`, `user:${address}:listedCount`]
  ];

  const offset = 0;
  const limit = 100;

  let scoreMemberPairs = [];

  // get first page
  let result = await addressToListings(address, offset, limit);
  result.page.forEach(listing => scoreMemberPairs.push(formatEther(listing.price), Number(listing.tokenId)))

  // get remaining pages
  while (Number(result.nextOffset) < Number(result.totalItems)) {
    result = await addressToListings(address, Number(result.nextOffset), limit)
    result.page.forEach(listing => scoreMemberPairs.push(formatEther(listing.price), Number(listing.tokenId)))
  }

  if (scoreMemberPairs.length) {
    cmds.push(
      ["ZADD", `user:${address}:listed`, ...scoreMemberPairs],
    )
  }

  cmds.push(
    ["SET", `user:${address}:listedCount`, `${scoreMemberPairs.length / 2}`],
    ["EXPIRE", `user:${address}:listed`, `${timeToCache}`],
    ["EXPIRE", `user:${address}:listedCount`, `${timeToCache}`],
  );

  
  const success = await runRedisTransaction(cmds);

  // console.log('did we successfully update the listing cache?', success)
  // const stop = Date.now();
  // console.log('updateListedCache time taken', stop - start);
}

export const getListedCount = async (address, skipCache = false): Promise<number> => {
  if (!address) {
    return null;
  }

  let listedCount = skipCache ? null : await client.get<number>(`user:${address}:listedCount`);

  if (listedCount === null) {
    await updateListedCache(address);
    listedCount = await client.get<number>(`user:${address}:listedCount`);
  }

  return listedCount;
}

// Requests the number of accounts address follows
route.get(async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const count = await getListedCount(address);
  res.status(200).json(count);
});


export default route;
