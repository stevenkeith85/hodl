import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

const client = Redis.fromEnv()
import apiRoute from "../handler";

dotenv.config({ path: '../.env' })
const route = apiRoute();

// remember when the user last read their notifications
export const setNotificationsLastRead = async (address) => {
    return await client.set(`user:${address}:notifications:lastRead`, Date.now());
}

export const getNotificationsLastRead = async (address) => {
    return await client.get(`user:${address}:notifications:lastRead`);
}

// check when the user last read their notifications
route.get(async (req, res: NextApiResponse) => {
    if (!req.address) {
        return res.status(403).json({ message: "Not Authenticated" });
    }

    const time = await getNotificationsLastRead(req.address);

    return res.status(200).json(time);
});

route.post(async (req, res: NextApiResponse) => {
    if (!req.address) {
        return res.status(403).json({ message: "Not Authenticated" });
    }

    const success = await setNotificationsLastRead(req.address);

    if (success) {
        return res.status(200).json({ message: 'success' });
    } else {
        return res.status(200).json({ message: 'unable to mark notifications as read' }); // TODO: should perhaps send a retry status code
    }
});


export default route;
