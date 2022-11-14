import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';

import apiRoute from "../handler";

import { chunk } from "../../../lib/lodash";

const client = Redis.fromEnv();
const route = apiRoute();


export const getUserProcessedTxs = async (address: string, offset: number, limit: number) => {

    try {
        const total = await client.zcard(`user:${address}:txs`);

        // ZRANGE: Out of range indexes do not produce an error.
        // So we need to check here and return if we are about to do an out of range search
        if (offset >= total) {
            return {
                items: [],
                next: Number(offset) + Number(limit),
                total: Number(total)
            };
        }

        let txs = await client.zrange(`user:${address}:txs`, 0, -1, { withScores: true, rev: true });
        txs = chunk(txs, 2);

        txs = txs.map(([hash, timestamp]) => ({hash, timestamp}));

        return {
            items: txs,
            next: Number(offset) + Number(limit),
            total: Number(total)
        };
    } catch (e) {
        return {
            items: [],
            next: 1,
            total: 0
        };
    }
}

route.get(async (req, res: NextApiResponse) => {
    if (!req.address) {
        return res.status(403).json({ message: "Not Authenticated" });
    }

    const offset = Array.isArray(req.query.offset) ? req.query.offset[0] : req.query.offset;
    const limit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;

    if (+limit > 100) {
        return new Response(null, { status: 400 });
      }

    const txs = await getUserProcessedTxs(req.address, +offset, +limit);
    res.status(200).json(txs);
});


export default route;
