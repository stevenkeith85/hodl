import { NextApiResponse } from "next";

import apiRoute from "../handler";

import { HodlAction, ActionTypes } from "../../../models/HodlAction";
import { ethers } from "ethers";
import { getProvider } from "../../../lib/server/connections";
import { nftmarketaddress } from "../../../config";

import Market from '../../../artifacts/contracts/HodlMarket.sol/HodlMarket.json';
import { addAction } from "../actions/add";
import { Redis } from '@upstash/redis';
import { NUMBER_OF_CONFIRMATIONS_TO_WAIT_FOR } from "../../../lib/utils";
import { getTagsForToken } from "../tags";


const route = apiRoute();
const client = Redis.fromEnv()

route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { hash } = req.body;

  const provider = await getProvider();

  // TODO: Check req.address initiated this transaction. Abort if not.

  provider.waitForTransaction(hash, NUMBER_OF_CONFIRMATIONS_TO_WAIT_FOR).then(async (txReceipt) => {

    const contract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
    const log = txReceipt.logs?.[0];

    if (!log) {
      // TODO: Handle this
      console.log('market/delist - unable to retrieve the transaction log');
    }

    const parsedLog = contract.interface.parseLog(log);

    const { tokenId: tokenIdBN, seller } = parsedLog.args;
    const tokenId = tokenIdBN.toNumber();

    const removed = await client.zrem(`market`, tokenId);

    if (!removed) {
      // TODO: Handle this
      console.log('market/delist - unable to remove the token from the  market zset');
    }

    const tags = await getTagsForToken(tokenId);

    for (const tag of tags) {
      const removed = await client.zrem(`market:${tag}`, tokenId);

      if (!removed) {
        // TODO: Handle this
        console.log(`market/delist - unable to remove token from market:${tag} zset`);
      }
    }

    const delisted: HodlAction = {
      timestamp: Date.now(), // TODO: perhaps we can get the timestamp of the transaction confirmation?
      action: ActionTypes.Delisted,
      subject: seller,
      object: "token",
      objectId: tokenId,
    };

    const success = await addAction(delisted);


    if (!success) {
      // TODO: Handle this
      console.log('market/delist - unable to add the action');
    }
  })

  return res.status(202).json({ message: 'accepted' });
});


export default route;
