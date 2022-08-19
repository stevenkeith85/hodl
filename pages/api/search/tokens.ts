import dotenv from 'dotenv'
import apiRoute from '../handler';
import { getToken } from '../token/[tokenId]';
import { Redis } from '@upstash/redis';

import { getAsString } from '../../../lib/utils';
import { Token } from '../../../models/Token';
import { instance } from '../../../lib/axios';

const client = Redis.fromEnv()

dotenv.config({ path: '../.env' })


export const getTokenSearchResults = async (q: string, offset: number, limit: number, forSale: boolean = false) => {
    try {
        let ids = []
        let total = 0;

        const tag = q;

        if (forSale) {
            // TODO: We will add tokens to the market ZSET when the user lists them
            // and remove them when bought/delisted.

            // initially we'll call this behaviour from the webapp; but potentially we'll need 
            // qStash or something to do this as a batch job. (even if its just to find items that have been missed)


            if (tag) {
                // should the interstare happen in a batch job? qStash?
                // or perhaps we just update it when things are listed/delisted
                // leaving here for development at the moment
                await client.zinterstore(`market:tag:${tag}`, 2, ["market", `tag:${tag}`], {
                    aggregate: 'max'
                })

                total = await client.zcard(`market:tag:${tag}`);


            } else {
                total = await client.zcard(`market`);
            }
        }
        else {
            if (tag) {
                total = await client.zcard(`tag:${tag}`);
            } else {
                total = await client.zcard(`tokens`);
            }
        }

        if (offset >= total) {
            return {
                items: [],
                next: Number(total),
                total: Number(total)
            };
        }

        if (forSale) {
            // TODO: We will add tokens to the market ZSET when the user lists them
            // and remove them when bought/delisted.

            // initially we'll call this behaviour from the webapp; but potentially we'll need 
            // qStash or something to do this as a batch job. (even if its just to find items that have been missed)


            if (tag) {
                // should the interstare happen in a batch job? qStash?
                // or perhaps we just update it when things are listed/delisted
                // leaving here for development at the moment
                await client.zinterstore(`market:tag:${tag}`, 2, ["market", `tag:${tag}`], {
                    aggregate: 'max'
                })

                ids = await client.zrange(`market:tag:${tag}`, offset, offset + limit - 1, { rev: true });
            } else {
                ids = await client.zrange("market", offset, offset + limit - 1, { rev: true });
            }
        }
        else {
            if (tag) {
                ids = await client.zrange(`tag:${tag}`, offset, offset + limit - 1, { rev: true });
            } else {
                ids = await client.zrange("tokens", offset, offset + limit - 1, { rev: true });
            }
        }

        const promises = ids.map(address => getToken(address));
        const tokens: Token[] = await Promise.all(promises);

        return { items: tokens, next: Number(offset) + Number(ids.length), total: Number(total) };
    } catch (e) {
        return { items: [], next: 0, total: 0 };
    }
}


const route = apiRoute();
route.get(async (req, res) => {
    console.log('req.query', req.query)
    const q = getAsString(req.query.q);
    console.log('req.query.forSale', req.query.forSale);
    const forSale = getAsString(req.query.forSale); // true, false ? TODO: Determine what we want to support
    console.log('forSale', forSale);
    const offset = getAsString(req.query.offset);
    const limit = getAsString(req.query.limit);

    if (!offset || !limit) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    // TODO: Add in some yup validation

    const data = await getTokenSearchResults(q, +offset, +limit, JSON.parse(forSale || "false"));
    return res.status(200).json(data);
});


export default route;
