import axios from 'axios'

// TODO: Move this somewhere
// Returns whether the operation was successful or not
export const updateTransactionRecords = async (address: string, nonce: number, hash: string): Promise<boolean> => {
    console.log('blockchain/transaction - updating processed records');

    try {
        const r = await axios.post(
            `${process.env.UPSTASH_REDIS_REST_URL}/multi-exec`,
            [
                ["HSET", `user:${address}`, 'nonce', nonce],
                ["ZADD", `user:${address}:txs`, Date.now(), hash],
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