import apiRoute from "../../../handler";
import { NextApiResponse } from 'next';
import { getAsString } from '../../../../../lib/getAsString';
import { runRedisTransaction } from '../../../../../lib/database/rest/databaseUtils';

import HodlMarket from '../../../../../../smart-contracts/artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import { getProvider } from '../../../../../lib/server/connections';
import { Contract } from '@ethersproject/contracts'
import { formatEther } from '@ethersproject/units'
import { zScore } from "../../../../../lib/database/rest/zScore";


const route = apiRoute();


const addressToListings = async (address, offset, limit) => {
  const provider = await getProvider();
  const market = new Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, HodlMarket.abi, provider);
  const result = await market.getListingsForAddress(address, offset, limit);
  return result;
}

export const updateListedCache = async (address) => {

  const isValidUser = await zScore('users', address);

  if (isValidUser === null) {
    throw new Error("Asked to update cache for an unknown address");
  }
  
  const offset = 0;
  const limit = 250;

  let scoreMemberPairs = [];

  // get first page
  let result = await addressToListings(address, offset, limit);
  result.page.forEach(listing => scoreMemberPairs.push(formatEther(listing.price), Number(listing.tokenId)))

  // get remaining pages
  while (Number(result.nextOffset) < Number(result.totalItems)) {
    result = await addressToListings(address, Number(result.nextOffset), limit)
    result.page.forEach(listing => scoreMemberPairs.push(formatEther(listing.price), Number(listing.tokenId)))
  }

  const cmds = [
    ['DEL', `user:${address}:listed`, `user:${address}:listedCount`]
  ];

  if (scoreMemberPairs.length) {
    cmds.push(
      ["ZADD", `user:${address}:listed`, ...scoreMemberPairs],
    )
  }

  cmds.push(
    ["SET", `user:${address}:listedCount`, `${scoreMemberPairs.length / 2}`],
  );

  
  await runRedisTransaction(cmds);
}

route.post(async (req, res: NextApiResponse) => {
  if (req.query.secret !== process.env.ZEPLO_SECRET) {
    return res.status(401).json({ message: 'unauthenticated' });
  }

  const address = getAsString(req.body.address);

  try {
    await updateListedCache(address)
  } catch (e) {
    return res.status(400).json({ message: e.message })
  }


  return res.status(200).json({ message: 'success' });
});


export default route;
