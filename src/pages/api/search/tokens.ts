import apiRoute from '../handler';
import { getToken } from '../token/[tokenId]';
import { Redis } from '@upstash/redis';

import { FullToken } from '../../../models/Nft';
import { chunk } from '../../../lib/lodash';
import { getAsString } from '../../../lib/getAsString';

const client = Redis.fromEnv()

const getMarketItem = async ([id, price]): Promise<FullToken> => {
    console.log(`search/tokens/getMarketItem - id: ${id}, price: ${price}`)
    return {
        ...(await getToken(id)),
        forSale: true,
        price
    }
}

export const getTokenSearchResults = async (
    q: string,
    offset: number,
    limit: number,
    forSale: boolean = false,
    minPrice: number = null,
    maxPrice: number = null
) => {
    try {
        let ids = []
        let total = 0;

        const tag = q.toLowerCase();

        let tokens;

        if (forSale) {
            if (tag) {                
                total = await client.zcount(
                    `market:${tag}`,
                    minPrice || '-inf',
                    maxPrice || '+inf',
                )
            } else {
                total = await client.zcount(
                    "market",
                    minPrice || '-inf',
                    maxPrice || '+inf',
                )
            }
        }
        else {
            // if the user is 'exploring', then we 
            // use the restricted size sets 'tokens:new' and 'tags:new' rather than the larger sets 'tokens' and 'tags'
            // as those can grow infinitely, and would eventually slow down the ui
            if (tag) {
                total = await client.zcard(`tag:${tag}:new`);
            } else {
                total = await client.zcard(`tokens:new`);
            }
        }

        if (offset >= total) {
            return {
                items: [],
                next: Number(offset) + Number(limit),
                total: Number(total)
            };
        }

        if (forSale) {
            if (tag) {
                ids = await client.zrange(
                    `market:${tag}`,
                    minPrice || '-inf',
                    maxPrice || '+inf',
                    {
                        withScores: true,
                        byScore: true,
                        offset,
                        count: limit
                    }
                );
            } else {
                ids = await client.zrange(
                    "market",
                    minPrice || '-inf',
                    maxPrice || '+inf',
                    {
                        withScores: true,
                        byScore: true,
                        offset,
                        count: limit
                    }
                );
            }

            ids = chunk(ids, 2);
            const promises = ids.map(item => getMarketItem(item));
            tokens = await Promise.all(promises);
        }
        else {
            // if the user is 'exploring', then we 
            // use the restricted size sets 'tokens:new' and 'tags:new' rather than the larger sets 'tokens' and 'tags'
            // as those can grow infinitely, and would eventually slow down the ui
            if (tag) {
                ids = await client.zrange(`tag:${tag}:new`, offset, offset + limit - 1, { rev: true });
            } else {
                ids = await client.zrange("tokens:new", offset, offset + limit - 1, { rev: true });
            }

            const promises = ids.map(address => getToken(address));
            tokens = await Promise.all(promises);
        }

        return {
            items: tokens,
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
    const forSale = getAsString(req.query.forSale); // true, false ? TODO: Determine what we want to support

    const offset = getAsString(req.query.offset);
    const limit = getAsString(req.query.limit);

    const minPrice = getAsString(req.query.minPrice);
    const maxPrice = getAsString(req.query.maxPrice);

    console.log('minPrice', minPrice)

    if (!offset || !limit) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    // TODO: Add in some yup validation

    const data = await getTokenSearchResults(
        q || '',
        +offset,
        +limit,
        JSON.parse(forSale || "false"),
        +minPrice || 0,
        +maxPrice || 1000000
    );
    return res.status(200).json(data);
});


export default route;
