import axios from "axios";
import { HodlAction } from "../../models/HodlAction";
import { User } from "../../models/User";
import { Redis } from '@upstash/redis';

const client = Redis.fromEnv()

export const addActionToQueue = async (
    accessToken: string,
    refreshToken: string,
    hodlAction: HodlAction) => {
    const user = await client.hmget<User>(`user:${hodlAction.subject}`, 'actionQueueId');

    const url = `https://api.serverlessq.com?id=${user?.actionQueueId}&target=https://${process.env.VERCEL_URL || process.env.MESSAGE_HANDLER_HOST}/api/actions/add`;
    try {
        const r = await axios.post(
            url,
            {
                action: hodlAction.action,
                object: hodlAction.object,
                objectId: hodlAction.objectId
            },
            {
                withCredentials: true,
                headers: {
                    "Accept": "application/json",
                    "x-api-key": process.env.SERVERLESSQ_API_TOKEN,
                    "Content-Type": "application/json",
                    "Cookie": `refreshToken=${refreshToken}; accessToken=${accessToken}`
                }
            }
        )
    } catch (e) {
        console.log('unable to add an action to the queue', hodlAction, e)
        return false; // We will likely want to retry this; so its an unsuccessful run of this function
    }

    return true;
}