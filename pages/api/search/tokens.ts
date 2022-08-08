import dotenv from 'dotenv'
import apiRoute from '../handler';
import { getToken } from '../token/[tokenId]';
import { Redis } from '@upstash/redis';

import axios from 'axios';
import { getAsString } from '../../../lib/utils';

const client = Redis.fromEnv()

dotenv.config({ path: '../.env' })


export const getTokenSearchResults = async (q: string, offset: number, limit: number) => {
    try {
        let ids = []
        const tokens = [];
        let total = 0;

        const tag = q;

        if (tag) {
            const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/tag:${tag}/${offset}/${offset + limit - 1}/rev`, {
                headers: {
                    Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
                }
            })
            ids = r.data.result
            total = await client.zcard(`tag:${tag}`);
        } else {
            const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/tokens/${offset}/${offset + limit - 1}/rev`, {
                headers: {
                    Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
                }
            })
            ids = r.data.result
            total = await client.zcard(`tokens`);
        }

        if (ids.length) {
            for (const id of ids) {
                const data = await getToken(id);

                if (data) {
                    tokens.push(data);
                }
            }
        }

        return { items: tokens, next: Number(offset) + Number(ids.length), total: Number(total) };
    } catch (e) {
        return { items: [], next: 0, total: 0 };
    }
}


const route = apiRoute();
route.get(async (req, res) => {
    const q = getAsString(req.query.q);
    const offset = getAsString(req.query.offset);
    const limit = getAsString(req.query.limit);

    if (!offset || !limit) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    const data = await getTokenSearchResults(q, +offset, +limit);
    return res.status(200).json(data);
});


export default route;
