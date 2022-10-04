import dotenv from 'dotenv'
import apiRoute from '../handler';
import { Redis } from '@upstash/redis';

import { UserViewModel } from '../../../models/User';
import { getUser } from '../user/[handle]';
import { getAsString } from '../../../lib/utils';

const client = Redis.fromEnv()

dotenv.config({ path: '../.env' })


// TODO: This isn't being used yet; but we'd like to adapt it for the search bar
// Pretty basic at the moment. We'll just return the newest users.
// We should at least allow a lookup by nickname/address though. ideally a partial match
export const getUserSearchResults = async (q: string | null, offset: number, limit: number, viewer = null) => {
    try {
        const total = await client.zcard(`users`);

        if (offset >= total) {
            return {
                items: [],
                next: Number(offset) + Number(limit),
                total: Number(total)
            };
        }

        const addresses: string[] = await client.zrange(`users`, offset, offset + limit - 1, { rev: true });
        const promises = addresses.map(address => getUser(address, viewer));
        const users: UserViewModel[] = await Promise.all(promises);

        return {
            items: users,
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


const route = apiRoute();
route.get(async (req, res) => {
    const q = getAsString(req.query.q);
    const offset = getAsString(req.query.offset);
    const limit = getAsString(req.query.limit);

    if (!offset || !limit) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    const data = await getUserSearchResults(q, +offset, +limit, req?.address);
    return res.status(200).json(data);
});


export default route;
