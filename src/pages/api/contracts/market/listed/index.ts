import apiRoute from '../../../handler';
import { Token } from "../../../../../models/Token";
import { Redis } from '@upstash/redis';
import { FullToken } from "../../../../../models/FullToken";
import { getAsString } from '../../../../../lib/getAsString';
import { updateListedCache } from './updateCache';
import { get } from '../../../../../lib/database/rest/get';
import { addToZeplo, addToZeploWithUserAuth } from '../../../../../lib/addToZeplo';
import { zRange } from '../../../../../lib/database/rest/zRange';
import { mGetTokens } from '../../../../../lib/database/rest/Tokens';

const client = Redis.fromEnv();

export const getListed = async (
    address: string,
    offset: number,
    limit: number,
    req
): Promise<{ items: Token[], next: number; total: number }> => {
    if (!address) {
        return null;
    }

    let listedCount = await get(`user:${address}:listedCount`);

    if (listedCount === null) { // repopulate the cache  
        // Previously, we emptied the cached data after a TTL; 
        // So there's a chance the cache is empty on prod. 
        // We'll probably ping all the profiles before going live to fill the cache
        // But if for some reason we don't have this users cached data, we should request it
        // They should get the updated data on a refresh or after a SWR revalidation :)

        // Longer term, this can probably go; although it might be nice to have if we decide to bring back a TTL
        // on data. (with a high value; maybe 30 days or something)

        addToZeplo(
            'api/contracts/market/listed/updateCache',
            {
                address
            }
        );
        
        return {
            items: [],
            next: Number(offset) + Number(limit),
            total: Number(0)
        };
    }

    if (Number(listedCount) === 0) {
        return {
            items: [],
            next: Number(offset) + Number(limit),
            total: Number(0)
        };
    }

    const tokenIdsWithPrice = await zRange(`user:${address}:listed`, offset, offset + limit - 1, { withScores: true});

    const tokenIdToPriceMap = tokenIdsWithPrice.reduce(
        (map, currentValue, currentIndex, array) => {
            if (currentIndex % 2 == 0 && currentIndex < (array.length - 1)) {
                map[currentValue] = array[currentIndex + 1];
            }

            return map;

        }, {}
    );

    const tokenIds = Object.keys(tokenIdToPriceMap);
    const tokens = tokenIds?.length ? await mGetTokens(tokenIds) : [];

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

    // We only allow 100 items at a time
    if (+limit > 100) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    const data = await getListed(address, +offset, +limit, req);
    return res.status(200).json(data);
});


export default route;
