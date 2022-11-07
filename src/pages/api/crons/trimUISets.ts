import { NextApiResponse } from "next";
import apiRoute from "../handler";

import { Redis } from '@upstash/redis';

const route = apiRoute();
const client = Redis.fromEnv()

// TODO: Could we heavily rate limit this; in case something goes wrong?

// We possibly will want to do these at different times? (Starting simple to begin with though)
route.post(async (req, res: NextApiResponse) => {

    if (req.query.secret !== process.env.ZEPLO_SECRET) {
        console.log("endpoint not called via our message queue");
        return res.status(401).json({ message: 'unauthenticated' });
    }

    const pipeline = client.pipeline();

    pipeline.zremrangebyrank('rankings:token:likes:count', 0, -(500 + 1));
    pipeline.zremrangebyrank('rankings:user:followers:count', 0, -(500 + 1));
    pipeline.zremrangebyrank(`users:new`, 0, -(500 + 1));
    pipeline.zremrangebyrank(`tokens:new`, 0, -(1000 + 1)); // This set is used by explore

    const result = await pipeline.exec();

    console.log('Entries Removed: Most Likes / Most Followers / New Users / New Tokens - ', result);

    return res.status(200).json({ message: 'ok' });
});


export default route;
