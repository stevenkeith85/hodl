import { NextApiResponse } from "next";
import apiRoute from "../handler";
import { getProvider } from "../../../lib/server/connections";
import { Redis } from '@upstash/redis';
import { validTxHashFormat } from "../../../lib/utils";
import { User } from "../../../models/User";
import { queueTxAndAction } from "../../../lib/addToZeplo";
import { addPendingTransaction } from "../../../lib/transactions/updateTransactionRecords";
import { getAsString } from "../../../lib/getAsString";

import { getPersonalSignData } from "./getPersonalSignData";

const route = apiRoute();
const client = Redis.fromEnv()

// This route decides if we should add something to the queue
//
// Currently;
// Only authenticated users can call it
// The caller must be the transaction author
// The contract must be one of ours
// The transaction nonce must be higher than the last one we successfully processed
// It must be a valid transaction

// This could be vulnerable to CSRF. To prevent this we are setting the auth cookies to LAX.
// https://portswigger.net/web-security/csrf/samesite-cookies
route.post(async (req, res: NextApiResponse) => {
  // console.log('TRANSACTION QUEUER CALLED');

  const hash = getAsString(req.body.hash);

  if (!validTxHashFormat(hash)) {
    return res.status(400).json({ message: 'That does not look like a valid tx hash' });
  }

  if (!req.address) {
    return res.status(403).json({ message: "You are not Authenticated" });
  }

  const provider = await getProvider();
  const tx = await provider.getTransaction(hash);

  if (tx === null) {
    console.log(`queue/transaction - unknown tx`);
    return res.status(400).json({ message: 'That transaction hash is not known on this blockchain.' });
  }

  let from = tx.from;
  let to = tx.to;
  let nonce = tx.nonce;

  const isMetaTx = to === process.env.NEXT_PUBLIC_BICONOMY_FORWARDER_ADDRESS;
  if (isMetaTx) {
    ({ from, to, nonce } = getPersonalSignData(tx));
  }

  if (from !== req.address) {
    console.log(`queue/transaction - user trying to process a transaction they did not sign for`);
    return res.status(400).json({ message: `You are trying to queue a tx that you did not sign for. from ${from}, req.address ${req.address}` });
  }

  if (to !== process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS &&
    to !== process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS) {
    console.log(`queue/transaction - user trying to process a transaction that isn't for our contract`);
    return res.status(400).json({ message: 'You are trying to queue a tx that is not for one of our contracts' });
  }

  // We can make sure meta txs are done in the right order, 
  // and we can make sure regular txs are done in the right order (by looking at batchNonce, and nonce)
  // 
  // This is probably good enough, as our processing functions are idempotent.

  // e.g.
  // create with normal (succeed)
  // list with meta (we miss this)
  // delist with normal (it would fail anyways)
  //
  // TODO: We probably want to move away from the batch processing tx model and move more to a sync with the blockchain type model
  // We could move the minting stuff first and then think about how the market would work
  //
  // I think there's alchemy APIs that could help out here.

  if (isMetaTx) {
    const user = await client.hmget<User>(`user:${req.address}`, 'batchNonce');

    if (nonce <= user?.batchNonce ?? -1) {
      console.log(`queue/transaction - last batchNonce we've handled for the user is ${user?.batchNonce}. queued tx batchNonce is ${nonce}`);
      return res.status(400).json({ message: 'Transactions must be processed in the same order they were processed on the blockchain' });
    }
  }
  else {
    const user = await client.hmget<User>(`user:${req.address}`, 'nonce');

    if (nonce <= user.nonce) {
      console.log(`queue/transaction - last nonce we've handled for the user is ${user?.nonce}. queued tx nonce is ${tx?.nonce}`);
      return res.status(400).json({ message: 'Transactions must be processed in the same order they were processed on the blockchain' });
    }
  }

  const success = await queueTxAndAction(hash, req.address);

  if (!success) {
    return res.status(501).json({ message: 'We were unable to queue tx at the moment; please try later' });
  }

  await addPendingTransaction(req.address, tx.nonce, hash);

  return res.status(202).json({ message: 'accepted' });
});


export default route;
