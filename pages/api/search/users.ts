import dotenv from 'dotenv'
import apiRoute from '../handler';
import { Redis } from '@upstash/redis';

import axios from 'axios';
import { User } from '../../../models/User';
import { getUser } from '../user/[handle]';

const client = Redis.fromEnv()

dotenv.config({ path: '../.env' })


// Pretty basic at the moment. We'll just return the newest users.
// We should at least allow a lookup by nickname/address though. ideally a partial match
export const getUserSearchResults = async (q, offset, limit) => {
    try {
        const users : User []= [];
        let addresses = [];
        let total = 0;

        const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/users/${offset}/${offset + limit - 1}/rev`, {
            headers: {
                Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
            }
        })
        addresses = r.data.result
        total = await client.zcard(`users`);

        if (addresses.length) {
            for (const address of addresses) {
                const data = await getUser(address);

                if (data) {
                    users.push(data);
                }
            }
        }

        return { items: users, next: Number(offset) + Number(addresses.length), total: Number(total) };
    } catch (e) {
        return { items: [], next: 0, total: 0 };
    }
}


const route = apiRoute();
route.get(async (req, res) => {
    const { q, offset, limit } = req.query;

    const data = await getUserSearchResults(q, offset, limit);
    return res.status(200).json(data);
});


export default route;
