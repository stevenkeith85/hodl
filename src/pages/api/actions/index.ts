import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import apiRoute from "../handler";
import { ActionSet, HodlAction, HodlActionViewModel } from "../../../models/HodlAction";
import { getToken } from "../token/[tokenId]";
import { getComment } from "../comment";
import { getUser } from "../user/[handle]";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv();

const route = apiRoute();

// Gets the HodlAction  and adds the user, token and comment to it to create the HodlActionViewModel
// We can get some data in parallel, like the user and token as they don't rely on each other
export const getAction = async (id, viewer): Promise<HodlActionViewModel | null> => {
  const hodlAction: HodlAction = await client.get(`action:${id}`);

  if (!hodlAction) {
    return null;
  }

  const vm: HodlActionViewModel = {
    ...hodlAction,
  };

  const userPromise = getUser(hodlAction.subject, viewer);

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

// ZRANGE is O(log(N)+M), with N being the number of elements in the set. 
// We trim the sets accessed via the UI. We may wish to trim the other sets at some point though. (and possibly archive the data)
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

  // ZRANGE: Out of range indexes do not produce an error.
  // So we need to check here and return if we are about to do an out of range search
  if (offset >= total) {
    return {
      items: [],
      next: Number(offset) + Number(limit),
      total: Number(total)
    };
  }

  const actionIds : string [] = await client.zrange(`user:${address}:${set}`, offset, offset + limit - 1, { rev: true });

  const actionPromises = actionIds.map(id => getAction(id, address));

  const actions: HodlActionViewModel[] = await Promise.all(actionPromises);

  return {
    items: actions,
    next: Number(offset) + Number(limit),
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
