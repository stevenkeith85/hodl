import { Contract } from '@ethersproject/contracts'
import { getProvider } from '../../../../../lib/server/connections';
import HodlNFT from '../../../../../../smart-contracts/artifacts/contracts/HodlNFT.sol/HodlNFT.json';

import { runRedisTransaction } from '../../../../../lib/database/rest/databaseUtils';
import apiRoute from "../../../handler";
import { NextApiResponse } from 'next';
import { getAsString } from '../../../../../lib/getAsString';
import { zScore } from '../../../../../lib/database/rest/zScore';

const route = apiRoute();

export const addressToTokenIds = async (address, offset, limit) => {
  const provider = getProvider();
  const tokenContract = new Contract(process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS, HodlNFT.abi, provider);
  const result = await tokenContract.addressToTokenIds(address, offset, limit);
  return result;
}

// HodlingCount and Hodling (Possibly needs updating to match current process. Still a work in progress)
//
// Why we store 2 keys, rather than just a ZSET (and do a ZCARD to get the count)..

// if hodlingCount (via a zcard lookup) was 0 then the set isn't present. (as REDIS does not allow empty sets)
// that could mean its expired (and we'd need to recache it via the blockchain)...
// 
// if the user 'actually' is hodling 0 (when we read the blockchain) then we need a way of saying that (again -> redis doesn't allow empty sets)

// if we can't say 'we checked but this user really does have nothing' then we'll effectively lose the ability to cache 'hodling 0 tokens'

// so we've decided to have hodling -> ZSET, AND hodlingCount -> number; and update them / expire them together

// when we do a GET hodlingCount, we can differentiate between 0 (user has nothing) and null (the cache has expired); and then update both during the caching process



// If a user mints or trades on the market; we'll recache.
//
// We will also give the user a 'sync' button and perhaps we just periodically sync ourselves
// This is required as the user could mint on us, then list on another marketplace
export const updateHodlingCache = async (address) => {

  const isValidUser = await zScore('users', address);

  if (isValidUser === null) {
    throw new Error("Asked to update cache for an unknown address");
  }

  const offset = 0;
  const limit = 250;

  let score = 0;
  let scoreMemberPairs = [];

  // get first page
  let result = await addressToTokenIds(address, offset, limit);
  result.page.forEach(item => scoreMemberPairs.push(score++, Number(item)));

  // get remaining pages
  while (Number(result.next) < Number(result.total)) {
    result = await addressToTokenIds(address, Number(result.next), limit);
    result.page.forEach(item => scoreMemberPairs.push(score++, Number(item)));
  }

  const cmds = [
    ['DEL', `user:${address}:hodling`, `user:${address}:hodlingCount`]
  ];

  if (scoreMemberPairs.length) {
    cmds.push(
      ["ZADD", `user:${address}:hodling`, ...scoreMemberPairs]
    );
  }

  cmds.push(
    ["SET", `user:${address}:hodlingCount`, `${scoreMemberPairs.length / 2}`],
  );

  await runRedisTransaction(cmds);
};


route.post(async (req, res: NextApiResponse) => {
  if (req.query.secret !== process.env.ZEPLO_SECRET) {
    return res.status(401).json({ message: 'unauthenticated' });
  }

  const address = getAsString(req.body.address);

  try {
    await updateHodlingCache(address)
  } catch (e) {
    return res.status(400).json({ message: e.message })
  }


  return res.status(200).json({ message: 'success' });
});


export default route;
