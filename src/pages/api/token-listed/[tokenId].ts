import { Contract } from '@ethersproject/contracts'
import { formatEther } from '@ethersproject/units'

import { getNickname } from "../profile/nickname";
import { getProvider } from "../../../lib/server/connections";
import Market from '../../../../smart-contracts/artifacts/contracts/HodlMarket.sol/HodlMarket.json';

// TODO: I don't think this is needed anymore?
export const getTokensListed = async tokenId => {
  const provider = await getProvider();

  const marketContract = new Contract(process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS, Market.abi, provider);
  const tokenFilter = marketContract.filters.TokenListed(null, tokenId);
  const txs = await marketContract.queryFilter(tokenFilter, 0, "latest");

  const result = [];

  for (let tx of txs) {
    const block = await tx.getBlock();

    const [sellerNickname] = await Promise.all([
      getNickname(tx.args.seller),
    ]);

    result.push({
      sellerNickname,
      sellerAddress: tx.args.seller,
      price: formatEther(tx.args.price),
      timestamp: block.timestamp
    })

  }

  return result.reverse(); // we want the newest first for the UI 
}
