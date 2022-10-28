import { NextApiResponse } from "next";
import apiRoute from "../handler";
import { getProvider } from "../../../lib/server/connections";
import { Redis } from '@upstash/redis';
import { validTxHashFormat } from "../../../lib/utils";
import { User } from "../../../models/User";
import { queueTxAndAction } from "../../../lib/addToZeplo";
import { addPendingTransaction } from "../../../lib/transactions/updateTransactionRecords";
import { getAsString } from "../../../lib/getAsString";

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

route.post(async (req, res: NextApiResponse) => {
  console.log('TRANSACTION QUEUER CALLED');

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
    return res.status(400).json({ message: 'That tx has is not known on this blockchain.' });
  }

  if (tx.from !== req.address) {
    console.log(`queue/transaction - user trying to process a transaction they did not create`);
    return res.status(400).json({ message: 'You are trying to queue a tx that you did not initiate' });
  }

  if (
    tx.to !== process.env.NEXT_PUBLIC_HODL_MARKET_ADDRESS &&
    tx.to !== process.env.NEXT_PUBLIC_HODL_NFT_ADDRESS) {
    console.log(`queue/transaction - user trying to process a transaction that isn't for our contract`);
    return res.status(400).json({ message: 'You are trying to queue a tx that is not for one of our contracts' });
  }

  const user = await client.hmget<User>(`user:${req.address}`, 'nonce');

  if (tx.nonce <= user.nonce) {
    console.log(`queue/transaction - user nonce is ${user?.nonce}. tx nonce is ${tx?.nonce}`);
    return res.status(400).json({ message: 'You are trying to queue a tx that is older than the last one we have successfully processed' });
  }

  const success = await queueTxAndAction(hash, req.cookies.refreshToken, req.cookies.accessToken, req.address);

  if (!success) {
    return res.status(501).json({ message: 'We were unable to queue tx at the moment; please try later' });
  }

  await addPendingTransaction(req.address, tx.nonce, hash);

  return res.status(202).json({ message: 'accepted' });
});


export default route;
