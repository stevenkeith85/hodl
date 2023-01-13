import { NextApiResponse } from "next";

import { Contract } from '@ethersproject/contracts'
import { formatEther } from '@ethersproject/units'

import { getProvider } from "../../../../../lib/server/connections";
import Market from '../../../../../../smart-contracts/artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import apiRoute from '../../../handler';

import { getAsString } from "../../../../../lib/getAsString";
import { getToken } from "../../../../../lib/database/rest/getToken";
import { runRedisTransaction } from "../../../../../lib/database/rest/databaseUtils";

// This should be called from the message queue to update our cache
//
// We store it like:
// event:tokenbought:tx => tx, buyer, seller, tokenId, price, time
//
// and could reference it from zsets like this: 
//
// initially:
// token:1:tokenbought -> (tx/time, tx/time)
//
// at a later date:
// market:tokenbought:time -> (tx/time, tx/time)
// market:tokenbought:price -> (tx/price, tx/price)

export const updateTokenBoughtCache = async (tokenId) => {
  // TODO: Do we care if we have the token data in the database yet? 
  // I suppose we might; as we maybe want to stop certain tokens being readded to the site
  // if we remove them and blacklist them
  const isValidToken = await getToken(tokenId);

  if (!isValidToken) {
    throw new Error("Asked to update cache for an unknown token");
  }

  try {
    const provider = await getProvider();

    const marketContract = new Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, provider);
    const tokenFilter = marketContract.filters.TokenBought(null, null, tokenId);

    const events = await marketContract.queryFilter(tokenFilter, "earliest", "latest");

    const tokenBoughtEvents = [];
    const zSetMembers = [];

    for (let event of events) {
      const block = await event.getBlock();

      tokenBoughtEvents.push([`event:tokenbought:${event.transactionHash}`, JSON.stringify({
        tx: event.transactionHash,
        seller: event.args.seller,
        buyer: event.args.buyer,
        tokenId: event.args.tokenId.toNumber(),
        price: formatEther(event.args.price),
        timestamp: block.timestamp
      })]);

      zSetMembers.push([block.timestamp, event.transactionHash])
    }

    // we store the count separately as an empty zset is valid for our use case. (i.e. we've checked the blockchain and the token hasn't been bought yet)
    // empty AND non-existent ZSETS both return 0.
    const cmds = [
      ["SET", `token:${tokenId}:tokenbought:count`, zSetMembers.length],
    ];

    // and if there are txs to store, we store them
    if (zSetMembers.length > 0) {
      cmds.push(
        ['MSET', ...tokenBoughtEvents.flat()],
        ['ZADD', `token:${tokenId}:tokenbought`, ...zSetMembers.flat()]
      );
    }

    await runRedisTransaction(cmds);
  } catch (e) {
    console.log(e)
  }
}

const route = apiRoute();

route.post(async (req, res: NextApiResponse) => {
  if (req.query.secret !== process.env.ZEPLO_SECRET) {
    return res.status(401).json({ message: 'unauthenticated' });
  }

  const tokenId = getAsString(req.body.tokenId);

  if (!tokenId) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  try {
    await updateTokenBoughtCache(tokenId)
  } catch (e) {
    return res.status(400).json({ message: e.message })
  }

  return res.status(200).json({ message: 'success' });
});

export default route;