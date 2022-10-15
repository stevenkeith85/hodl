import dotenv from 'dotenv'
import apiRoute from '../../../handler';
import { Token } from '../../../../../models/Token';
import { Redis } from '@upstash/redis';
import { updateHodlingCache } from './count';

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()


export const getHodling = async (address, offset, limit, skipCache = false): Promise<{ items: Token[], next: number; total: number }> => {
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
    }

    if (hodlingCount === 0) {
        return {
            items: [],
            next: Number(offset) + Number(limit),
            total: Number(0)
        };
    }

    const tokenIds: number[] = await client.zrange<number[]>(`user:${address}:hodling`, offset, offset + limit - 1);

    // const items: FullToken[] = await Promise.all(tokenIds.map(async id => {
    //     const token: Token = await getToken(id);

    //     // If the token is present on the blockchain, 
    //     // but not in our database
    //     // we'll mark this as null.
    //     if (!token) {
    //         return null;
    //     }

    //     const nft: FullToken = {
    //         ...token,
    //         hodler: address,
    //         forSale: false,
    //         price: null
    //     };

    //     return nft;
    // }));

    // We get all the comment data with one round trip to redis
    const commentPipeline = client.pipeline();
    for (let id of tokenIds) {
      commentPipeline.get(`token:${id}`);
    }
    const items: Token[] = tokenIds?.length ? await commentPipeline.exec() : [];


    return {
        items: items,
        next: Number(offset) + Number(limit),
        total: Number(hodlingCount)
    };
}

const route = apiRoute();

route.get(async (req, res) => {
    const { address, offset, limit } = req.query;

    if (!address || !offset || !limit) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    const data = await getHodling(address, offset, limit)

    return res.status(200).json(data);
});


export default route;
