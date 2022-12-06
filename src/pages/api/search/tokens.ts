import { NextRequest, NextResponse } from 'next/server';

import { getAsString } from '../../../lib/getAsString';
import { getTokenVMs } from '../../../lib/database/rest/Tokens';
import { zCard } from '../../../lib/database/rest/zCard';
import { zCount } from '../../../lib/database/rest/zCount';
import { zRange } from '../../../lib/database/rest/zRange';


export const getTokenSearchResults = async (
    q: string,
    offset: number,
    limit: number,
    forSale: boolean = false,
    minPrice: number = null,
    maxPrice: number = null
) => {
    // const start = Date.now();
    try {
        let ids = []
        let total = 0;

        const tag = q?.toLowerCase();

        let tokens;

        if (forSale) {
            if (tag) {
                total = await zCount(
                    `market:${tag}`,
                    minPrice || '-inf',
                    maxPrice || '+inf',
                )
            } else {
                total = await zCount(
                    `market`,
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
                total = await zCard(`tag:${tag}:new`);
            } else {
                total = await zCard(`tokens:new`);
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
            let idsWithPrices = [];

            if (tag) {
                idsWithPrices = await zRange(
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
                idsWithPrices = await zRange(
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

            // TODO: THIS IS ALSO USED ON THE PROFILE PAGE. EXTRACT TO COMMON LIB
            const tokenIdToPriceMap = idsWithPrices.reduce(
                (map, currentValue, currentIndex, array) => {
                    if (currentIndex % 2 == 0 && currentIndex < (array.length - 1)) {
                        map[currentValue] = array[currentIndex + 1];
                    }

                    return map;

                }, {}
            );

            // tokens = await mGetTokens(Object.keys(tokenIdToPriceMap));
            tokens = await getTokenVMs(Object.keys(tokenIdToPriceMap));

            // append the price
            tokens = tokens.map((token) => ({
                ...token,
                forSale: true,
                price: tokenIdToPriceMap[token.id]
            }))
        }
        else {
            // if the user is 'exploring', then we 
            // use the restricted size sets 'tokens:new' and 'tags:new' rather than the larger sets 'tokens' and 'tags'
            // as those can grow infinitely, and would eventually slow down the ui
            if (tag) {
                ids = await zRange(`tag:${tag}:new`, offset, offset + limit - 1, { rev: true });
            } else {
                ids = await zRange(
                    "tokens:new",
                    offset,
                    offset + limit - 1,
                    { rev: true }
                );
            }
            // tokens = await mGetTokens(ids);
            tokens = await getTokenVMs(ids)
        }
        // const stop = Date.now()
        // console.log('get data', stop - start);
        return {
            items: tokens,
            next: Number(offset) + Number(limit),
            total: Number(total)
        };
    } catch (e) {
        console.log(e)
        return {
            items: [],
            next: 1,
            total: 0
        };
    }
}


export default async function route(req: NextRequest) {
    if (req.method !== 'GET') {
        return new Response(null, { status: 405 });
    }

    const { searchParams } = new URL(req.url);

    const q = getAsString(searchParams.get('q'));
    const forSale = getAsString(searchParams.get('forSale'));

    const offset = getAsString(searchParams.get('offset'));
    const limit = getAsString(searchParams.get('limit'));

    const minPrice = getAsString(searchParams.get('minPrice'));
    const maxPrice = getAsString(searchParams.get('maxPrice'));


    if (!offset || !limit) {
        return new Response(null, { status: 400 });
    }

    // We only allow 100 items at a time
    if (+limit > 100) {
        return new Response(null, { status: 400 });
    }

    const data = await getTokenSearchResults(
        q || '',
        +offset,
        +limit,
        JSON.parse(forSale || "false"),
        +minPrice || 0,
        +maxPrice || 1000000
    );

    return NextResponse.json(data, {
        headers: {
            'Cache-Control': 'max-age=0, s-maxage=60'
        }
    });
};

export const config = {
    runtime: 'experimental-edge',
}
