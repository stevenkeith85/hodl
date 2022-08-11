import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import { ActionSet, HodlAction, HodlActionViewModel } from "../../../models/HodlAction";
import { getToken } from "../token/[tokenId]";
import { getComment } from "../comment";
import { getUser } from "../user/[handle]";
import { instance } from "../../../lib/axios";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

// Gets the HodlAction  and adds the user, token and comment to it to create the HodlActionViewModel
// We can get some data in parallel, like the user and token as they don't rely on each other
const actionIdToViewModel = async (id): Promise<HodlActionViewModel | null> => {
  const hodlAction: HodlAction = await client.get(`action:${id}`);

  if (!hodlAction) {
    return null;
  }

  const vm: HodlActionViewModel = {
    ...hodlAction,
  };

  const userPromise = getUser(hodlAction.subject);

  let tokenPromise = null;

  if (hodlAction.object === "comment") {
    vm.comment = await getComment(hodlAction.objectId, false);

    if (vm.comment) {
      tokenPromise = getToken(vm.comment.tokenId)
    }

  } else {
    tokenPromise = getToken(hodlAction.objectId);
  }

  const [user, token] = await Promise.all([userPromise, tokenPromise]);

  vm.user = user;
  vm.token = token;

  return vm;
}

// TODO: Set a max limit of 10 or something as we get the actions in parallel - so we don't want to hammer the db?

// TODO: ZRANGE is O(log(N)+M), with N being the number of elements in the set. 
// We should consider trimming this set size somehow. Possibly we trim it when we add actions. i.e. if it hits 100 or 1000 or something we add the leftover stuff to an archive
export const getActions = async (
  address: string,
  set: ActionSet = ActionSet.Notifications,
  offset: number = 0,
  limit: number = 10
): Promise<
  {
    items: HodlActionViewModel[],
    next: number,
    total: number
  }> => {

  if (!address) {
    return null;
  }
  
  const total = await client.zcard(`user:${address}:${set}`);

  if (offset >= total) {
    return {
      items: [],
      next: Number(total),
      total: Number(total)
    };
  }

  const r = await instance.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/user:${address}:${set}/${offset}/${offset + limit - 1}/rev`, {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
    },
  })

  const actionIds: string[] = r.data.result.map(item => JSON.parse(item));

  // The actions don't depend on each other, so we can do this async
  const actionPromises = actionIds.map(id => actionIdToViewModel(id));

  const actions: HodlActionViewModel[] = await Promise.all(actionPromises);

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
