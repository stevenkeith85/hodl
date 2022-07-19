import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import axios from 'axios'
import apiRoute from "../handler";
import { ActionSet, HodlAction } from "../../../models/HodlAction";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();


export const getActions = async (
  address: string,
  set: ActionSet = ActionSet.Notifications,
  offset: number = 0,
  limit: number = 10
): Promise<
  {
    items: HodlAction[],
    next: number,
    total: number
  }> => {
    
  const total = await client.zcard(`${set}:${address}`);

  if (offset >= total) {
    return {
      items: [],
      next: Number(total),
      total: Number(total)
    };
  }

  const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/${set}:${address}/${offset}/${offset + limit - 1}/rev`, {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
    }
  })

  const actionIds: string[] = r.data.result.map(item => JSON.parse(item));

  const actions: HodlAction[] = [];
  for (const id of actionIds) {
    actions.push(await client.get(`action:${id}`));
  }

  return {
    items: actions,
    next: Number(offset) + Number(actions.length),
    total: Number(total)
  };
}


route.get(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const set = Array.isArray(req.query.set) ? req.query.set[0] : req.query.set;
  const offset = Array.isArray(req.query.offset) ? req.query.offset[0] : req.query.offset;
  const limit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;

  if (!set || !offset || !limit) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  if (!Object.values(ActionSet).includes(set as ActionSet)) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const notifications = await getActions(req.address, set as ActionSet, +offset, +limit);

  res.status(200).json(notifications);

});


export default route;
