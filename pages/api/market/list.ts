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

  // TODO: 
  // we could let users re-run the transaction handlers (ensuring idempotency)
  // we could give them a 'help' page that they can paste their tx hash / type into a form and re-run the
  // backend api for that tx. (list/delist/mint/etc) to ensure their content on hodlmymoon is in-sync with the blockchain. 
  // (this gives us a way of fixing things if something goes wrong)
  //
  // an alternative is for us to run it for them using a batch script/qstash/something like that
  provider.waitForTransaction(hash, NUMBER_OF_CONFIRMATIONS_TO_WAIT_FOR).then(async (txReceipt) => {
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
    const log = txReceipt.logs?.[0];

    if (!log) {
      // TODO: Handle this
      console.log('market/list - unable to retrieve the transaction log');
    }

    const parsedLog = contract.interface.parseLog(log);

    const { tokenId: tokenIdBN, seller, price: priceInWei } = parsedLog.args;

    const price = ethers.utils.formatEther(priceInWei);
    const tokenId = tokenIdBN.toNumber();

    const added = await client.zadd(`market`,
      {
        score: +price,
        member: tokenId
      }
    );

    if (!added) {
      // TODO: Handle this
      console.log('market/list - unable to add token to market zset');
    }

    const tags = await getTagsForToken(tokenId);

    for (const tag of tags) {
      const added = await client.zadd(`market:${tag}`,
        {
          score: +price,
          member: tokenId
        }
      );

      if (!added) {
        // TODO: Handle this
        console.log(`market/list - unable to add token to market:${tag} zset`);
      }
    }

    const listed: HodlAction = {
      timestamp: Date.now(), // TODO: perhaps we can get the timestamp of the transaction confirmation?
      action: ActionTypes.Listed,
      subject: seller,
      object: "token",
      objectId: tokenId,
      metadata: {
        price
      }
    };

    const success = await addAction(listed);

    if (!success) {
      // TODO: Handle this
      console.log('market/list - unable to add the action');
    }
  })

  return res.status(202).json({ message: 'accepted' });
});


export default route;
