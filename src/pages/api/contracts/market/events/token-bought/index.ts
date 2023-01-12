import apiRoute from '../../../../handler';

import { getAsString } from '../../../../../../lib/getAsString';

import { mGet } from '../../../../../../lib/database/rest/mGet';
import { zRange } from '../../../../../../lib/database/rest/zRange';
import { get } from '../../../../../../lib/database/rest/get';
// import { addToZeplo } from '../../../../../../lib/addToZeplo';


export const getTokenBoughtEvents = async (
    tokenId: string,
    offset: number,
    limit: number,
): Promise<{ items: any[], next: number; total: number }> => {
    
    if (!tokenId) {
        return null;
    }

    let boughtEventsCount = await get(`token:${tokenId}:tokenbought:count`);
    
    if (boughtEventsCount === null) {
        // If the cache is empty for whatever reason, schedule an update
        // addToZeplo(
        //     'api/contracts/market/events/token-bought/updateCache',
        //     {
        //         tokenId
        //     },
        // );
        return {
            items: [],
            next: Number(offset) + Number(limit),
            total: Number(0)
        };
    }
    
    if (Number(boughtEventsCount) === 0 || boughtEventsCount === null) {
        return {
            items: [],
            next: Number(offset) + Number(limit),
            total: Number(0)
        };
    }

    
    const txs = await zRange(`token:${tokenId}:tokenbought`, offset, offset + limit - 1, {});

    const keys = txs ? txs.map(tx => `event:tokenbought:${tx}`): []

    let items = keys.length ? await mGet(...keys) : [];

    // we need to parse the json as mGet doesn't
    items = items.map(item => JSON.parse(item))

    return {
        items: items,
        next: Number(offset) + Number(limit),
        total: Number(boughtEventsCount)
    };
}

const route = apiRoute();
route.get(async (req, res) => {
    const tokenId = getAsString(req.query.tokenId);
    const offset = getAsString(req.query.offset);
    const limit = getAsString(req.query.limit);

    if (!tokenId || !offset || !limit) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    // We only allow 100 items at a time
    if (+limit > 100) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    const data = await getTokenBoughtEvents(tokenId, +offset, +limit, req);

    return res.status(200).json(data);
});


export default route;
