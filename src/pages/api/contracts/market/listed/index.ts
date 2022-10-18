import apiRoute from '../../../handler';
import { Token } from '../../../../../models/Token';
import { Redis } from '@upstash/redis';
import { updateListedCache } from './count';
import { getAsString } from '../../../../../lib/utils';
import { FullToken } from '../../../../../models/Nft';

const client = Redis.fromEnv();

export const getListed = async (address: string, offset: number, limit: number, skipCache = false): Promise<{ items: Token[], next: number; total: number }> => {
    if (!address) {
        return null;
    }

    let listedCount = skipCache ? null : await client.get<number>(`user:${address}:listedCount`);

    if (listedCount === null) { // repopulate the cache  
        await updateListedCache(address);
    } else {
        console.log('using listed cached data')
    }

    if (listedCount === 0) {
        return {
            items: [],
            next: Number(offset) + Number(limit),
            total: Number(0)
        };
    }

    const tokenIdsWithPrice: number[] = await client.zrange<number[]>(`user:${address}:listed`, offset, offset + limit - 1, { withScores: true });
    
    console.log('tokenIdsWithPrice', tokenIdsWithPrice);

    const tokenIdToPriceMap = tokenIdsWithPrice.reduce(
        (map, currentValue, currentIndex, array) => {
            console.log('map is ', map)
            if (currentIndex < (array.length - 1)) {
                map[currentValue] = array[currentIndex + 1];   
            }

            return map;
            
        }, {}
    );

    console.log('tokenIdToPriceMap', JSON.stringify(tokenIdToPriceMap));

    const tokenIds = Object.keys(tokenIdToPriceMap);


    // // We get all the comment data with one round trip to redis
    const pipeline = client.pipeline();
    for (let id of tokenIds) {
        pipeline.get(`token:${id}`);
    }
    const tokens: Token[] = tokenIds?.length ? await pipeline.exec() : [];

    const fullTokens = tokens.map(item => {
        const token: FullToken = {
            ...item,
            price: tokenIdToPriceMap[item.id],
            forSale: true
        }

        return token;
    })
    return {
        items: fullTokens,
        next: Number(offset) + Number(limit),
        total: Number(listedCount)
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

    const data = await getListed(address, +offset, +limit);
    return res.status(200).json(data);
});


export default route;
