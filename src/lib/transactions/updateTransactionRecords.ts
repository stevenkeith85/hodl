import axios from 'axios'
import { Redis } from '@upstash/redis';

// If we successfully add the tx to the queue, we add it to the users pending tx zset.
// This zset will store tx hashes and the associated nonce value
// This will allow us to put a check in the handlers to make sure we do not process anything out of order
//
// e.g. a tx could take a while to complete (with nonce 4); a new one could be added to the queue (with nonce 5)
// and complete much quicker. if 5 finishes first, it would update our 'last processed nonce' to 5, and tx with nonce 4 would
// error on the retry
//
// users would also appreciate knowing what's going on with their txs; and are less likely to try to submit something if its
// already pending.
//
// we could probably block them at that stage too.
//
// TODO: For the future - if the tx gets 'stuck' then we probably need the user to tell us they no longer wish to process it
// via a form. We could them bump that tx from the ZSET and retry the later ones?

const client = Redis.fromEnv();

export const addPendingTransaction = async (address: string, nonce: number, hash: string) => {
    console.log('blockchain/transaction - adding a new tx to the queue');

    await client.zadd(`user:${address}:txs:pending`, {
        score: nonce,
        member: hash
    });
}

// Once we've successfully processed the transaction, we add it to the users successful queue; and we
// update the last processed nonce value
export const updateTransactionRecords = async (address: string, nonce: number, hash: string): Promise<boolean> => {
    console.log('blockchain/transaction - updating processed records');

    try {
        const r = await axios.post(
            `${process.env.UPSTASH_REDIS_REST_URL}/multi-exec`,
            [
                ["HSET", `user:${address}`, 'nonce', nonce],
                ["ZADD", `user:${address}:txs`, Date.now(), hash],
                ["ZREM", `user:${address}:txs:pending`, hash]
            ],
            {
                headers: {
                    Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
                }
            });

        const response = r.data;

        if (response.error) {
            console.log('Upstash Redis Error - update user transaction details was discarded', response);
            return false; // We will likely want to retry this; so its an unsuccessful run of this function
        }
    } catch (e) {
        console.log('Upstash Redis error', e)
        return false; // We will likely want to retry this; so its an unsuccessful run of this function
    }

    return true;
}