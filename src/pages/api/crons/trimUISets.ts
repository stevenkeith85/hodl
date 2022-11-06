import { NextApiResponse } from "next";
import apiRoute from "../handler";

import { Redis } from '@upstash/redis';

const route = apiRoute();
const client = Redis.fromEnv()

route.post(async (req, res: NextApiResponse) => {

    if (req.query.secret !== process.env.ZEPLO_SECRET) {
        console.log("endpoint not called via our message queue");
        return res.status(401).json({ message: 'unauthenticated' });
    }

    const pipeline = client.pipeline();
    pipeline.zremrangebyrank('rankings:token:likes:count', 0, -(500 + 1))
    pipeline.zremrangebyrank(`tokens:new`, 0, -(1000 + 1))
    
    const [tokenLikesEntriesRemoved] = await pipeline.exec();

    console.log('tokenLikesEntriesRemoved', tokenLikesEntriesRemoved);

    return res.status(200).json({ message: 'ok'});
});


export default route;
