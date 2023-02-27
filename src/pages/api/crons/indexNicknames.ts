import { NextApiResponse } from "next";
import apiRoute from "../handler";

import { Redis } from '@upstash/redis';

const route = apiRoute();
const client = Redis.fromEnv()


const updateIndex = async (zSetKey: string, nicknames) => {
    const values = [];

    for (let nickname of nicknames) {
        for (let i = 1; i <= nickname.length; i++) {
            values.push(nickname.slice(0, i))
        }
        values.push(nickname + '*');
    }

    const scoreMembers = values.map(v => ({ score: 0, member: v }));

    // @ts-ignore
    await client.zadd(zSetKey, ...scoreMembers);
}

// TODO: Potentially, we want to store nicknames in a zset to avoid having to do a scan of the keys
// Maintaining the zset via the request/response cycle should be fast enough and we'd
// just build the substrings index from that every X mins
const getNicknames = async () => {
    let next = 0;
    let nicknames = [];

    do {
        let result = await client.scan(next, { match: 'nickname:*', count: 250, type: '' });
        next = result[0];

        // we map the keys to just the nicknames and add it to our nicknames collection
        nicknames = nicknames.concat(result[1].map(key => key.split(":")[1]));

    } while (next !== 0);

    return nicknames;
}


route.post(async (req, res: NextApiResponse) => {

    if (req.query.secret !== process.env.ZEPLO_SECRET) {
        console.log("endpoint not called via our message queue");
        return res.status(401).json({ message: 'unauthenticated' });
    }

    const nicknames = await getNicknames();

    // Rename will do an async del here; so we are all good. (Checked with upstash)
    await updateIndex('nicknamesIndex', nicknames);
    await client.rename('nicknamesIndex', 'nicknames');   
    

    return res.status(200).json({ message: 'ok' });
});


export default route;
