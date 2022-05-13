import { NextApiRequest, NextApiResponse } from "next";
import { ethers, BigNumber } from 'ethers'
import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from '../handler';
import { getNickname } from "../profile/nickname";
import { nftmarketaddress } from "../../../config";
import { getProvider } from "../../../lib/server/connections";
import Market from '../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json';
dotenv.config({ path: '../.env' })


export const getPriceHistory = async tokenId => {
  const provider = await getProvider();

  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
  const tokenFilter = marketContract.filters.TokenBought(null, null, BigNumber.from(tokenId));
  const txs = await marketContract.queryFilter(tokenFilter, 0, "latest");

  const result = [];

  for (let tx of txs) {
    const block = await tx.getBlock();

    const [sellerNickname, buyerNickname] = await Promise.all([
      getNickname(tx.args.seller),
      getNickname(tx.args.buyer),
    ]);

    result.push({
      sellerNickname,
      sellerAddress: tx.args.seller,
      buyerNickname,
      buyerAddress: tx.args.buyer,
      price: ethers.utils.formatEther(tx.args.price),
      timestamp: block.timestamp
    })

  }

  return result.reverse(); // we want the newest first for the UI 
}

// const route = apiRoute();

// route.get(async (req: NextApiRequest, res: NextApiResponse) => {
//   const { tokenId } = req.query;

//   if (!tokenId) {
//     return res.status(400).json({ message: 'Bad Request' });
//   }

//   const priceHistory = await getPriceHistory(tokenId)
//   res.status(200).json({ priceHistory })
// });

// export default route;
