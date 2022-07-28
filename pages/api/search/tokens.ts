import dotenv from 'dotenv'
import apiRoute from '../handler';
import { getToken } from '../token/[tokenId]';
import { Redis } from '@upstash/redis';

import axios from 'axios';

const client = Redis.fromEnv()

dotenv.config({ path: '../.env' })


export const getSearchResults = async (q, offset, limit) => {
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
                const data = await getToken(id);//await client.get<Token>(`token:${id}`);

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
    const { q, offset, limit } = req.query;

    const data = await getSearchResults(q, offset, limit);
    return res.status(200).json(data);
});


export default route;
