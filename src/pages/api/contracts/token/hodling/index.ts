import apiRoute from '../../../handler';
import { Token } from '../../../../../models/Token';
import { Redis } from '@upstash/redis';
import { updateHodlingCache } from './count';
import { getAsString } from '../../../../../lib/getAsString';


const client = Redis.fromEnv();

export const getHodling = async (address: string, offset: number, limit: number, skipCache = false): Promise<{ items: Token[], next: number; total: number }> => {
    if (!address) {
        return null;
    }

    // Why we store 2 keys, rather than just a ZSET (and do a ZCARD to get the count)..

    // if hodlingCount (via a zcard lookup) was 0 then the set isn't present. (as REDIS does not allow empty sets)
    // that could mean its expired (and we'd need to recache it via the blockchain)...
    // 
    // if the user 'actually' is hodling 0 (when we read the blockchain) then we need a way of saying that (again -> redis doesn't allow empty sets)

    // if we can't say 'we checked but this user really does have nothing' then we'll effectively lose the ability to cache 'hodling 0 tokens'

    // so we've decided to have holding -> ZSET, AND hodlingCount -> number; and update them / expire them together

    // when we do a GET hodlingCount, we can differentiate between 0 (user has nothing) and null (the cache has expired); and then update both during the caching process

    let hodlingCount = skipCache ? null : await client.get<number>(`user:${address}:hodlingCount`);

    if (hodlingCount === null) { // repopulate the cache  
        await updateHodlingCache(address);
    } else {
        console.log('using hodling cached data')
    }

    if (hodlingCount === 0) {
        return {
            items: [],
            next: Number(offset) + Number(limit),
            total: Number(0)
        };
    }

    const tokenIds: number[] = await client.zrange<number[]>(`user:${address}:hodling`, offset, offset + limit - 1);

    // We get all the comment data with one round trip to redis
    const pipeline = client.pipeline();
    for (let id of tokenIds) {
      pipeline.get(`token:${id}`);
    }
    const items: Token[] = tokenIds?.length ? await pipeline.exec() : [];


    return {
        items,
        next: Number(offset) + Number(limit),
        total: Number(hodlingCount)
    };
}

const route = apiRoute();

route.get(async (req, res) => {
    const address = getAsString(req.query.address);
    const offset = getAsString(req.query.offset);
    const limit = getAsString(req.query.limit);

    if (!address || !offset || !limit) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    const data = await getHodling(address, +offset, +limit)

    return res.status(200).json(data);
});


export default route;
