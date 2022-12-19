import apiRoute from '../../../handler';
import { Token } from "../../../../../models/Token";
import { getAsString } from '../../../../../lib/getAsString';

import { mGetTokens } from '../../../../../lib/database/rest/Tokens';
import { zRange } from '../../../../../lib/database/rest/zRange';
import { get } from '../../../../../lib/database/rest/get';
import { addToZeplo } from '../../../../../lib/addToZeplo';

export const getHodling = async (
    address: string,
    offset: number,
    limit: number,
    req
): Promise<{ items: Token[], next: number; total: number }> => {
    if (!address) {
        return null;
    }

    let hodlingCount = await get(`user:${address}:hodlingCount`);

    if (hodlingCount === null) {
        // Previously, we emptied the cached data after a TTL; 
        // So there's a chance the cache is empty on prod. 
        // We'll probably ping all the profiles before going live to fill the cache
        // But if for some reason we don't have this users cached data, we should request it
        // They should get the updated data on a refresh or after a SWR revalidation :)

        // Longer term, this can probably go; although it might be nice to have if we decide to bring back a TTL
        // on data. (with a high value; maybe 30 days or something)
        addToZeplo(
            'api/contracts/token/hodling/updateCache',
            {
                address
            },
            req.cookies.refreshToken,
            req.cookies.accessToken
        );
        return {
            items: [],
            next: Number(offset) + Number(limit),
            total: Number(0)
        };
    }

    if (Number(hodlingCount) === 0 || hodlingCount === null) {
        return {
            items: [],
            next: Number(offset) + Number(limit),
            total: Number(0)
        };
    }

    const tokenIds = await zRange(`user:${address}:hodling`, offset, offset + limit - 1, {});
    const items = tokenIds?.length ? await mGetTokens(tokenIds) : [];

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

    // We only allow 100 items at a time
    if (+limit > 100) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    const data = await getHodling(address, +offset, +limit, req);

    return res.status(200).json(data);
});


export default route;
