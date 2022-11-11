import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';

import apiRoute from "../handler";
import { ActionSet, HodlAction, HodlActionViewModel } from "../../../models/HodlAction";

import { getComment } from "../comment";
import { getUser } from "../user/[handle]";
import { getToken } from "../../../lib/database/rest/getToken";
import { mGetActions } from "../../../lib/database/rest/Actions";
import { getUsers } from "../../../lib/database/rest/Users";
import { mGetComments } from "../../../lib/database/rest/Comments";
import { getTokenVMs, mGetTokens } from "../../../lib/database/rest/Tokens";

const client = Redis.fromEnv();

const route = apiRoute();

// Gets the HodlAction  and adds the user, token and comment to it to create the HodlActionViewModel
// We can get some data in parallel, like the user and token as they don't rely on each other

// This is used by the pusher hover notification at the moment
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

  console.log('address, set, offset, limit', address, set, offset, limit)

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

  const zrangeStart = Date.now();

  // Get the action ids
  const idsResponse = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/zrange/user:${address}:${set}/${offset}/${offset + limit - 1}/rev`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
      }
    });

  const { result: ids } = await idsResponse.json();

  const zrangeStop = Date.now()
  console.log('zrange time taken', zrangeStop - zrangeStart);

  // Get the actions
  const mgetStart = Date.now();
  const actions = ids.length ? await mGetActions(ids) : [];
  const mgetStop = Date.now()
  console.log('mget time taken', mgetStop - mgetStart);

  // Each action has a subject. This is the address of the user who took the action
  const addresses: string[] = actions.map(action => action.subject);
  const uniqueAddresses = new Set(addresses);

  // We get the view models for the users
  const userVMs = await getUsers(Array.from(uniqueAddresses));

  const userMap = userVMs.reduce((map, user) => {
    map[user.address] = user;
    return map;
  }, {});

  // Get any comments attached to the actions. 
  const commentIds: string[] = actions.filter(action => action.object === 'comment').map(action => action.objectId);
  const uniqueCommentIds = new Set(commentIds);

  let comments = uniqueCommentIds.size ? await mGetComments(Array.from(uniqueCommentIds)) : [];

  // Users can delete comments. So remove any missing comments.
  comments = comments.filter(comment => comment);

  // Create an id to comment map so that we can extrapolate the user info for the UI
  const commentMap = comments.reduce((map, comment) => {
    map[comment.id] = comment;
    return map;
  }, {});

  // Get the tokenIds the comments were made on
  const tokenIdsForComments = comments.map(comment => comment.tokenId);

  // Get tokens attached to actions or comments
  const tokenIds: string[] = actions.filter(action => action.object === 'token').map(action => action.objectId).concat(tokenIdsForComments);
  const uniqueTokenIds = new Set(tokenIds);

  const tokens = uniqueTokenIds.size ?
    set === ActionSet.Notifications ? await mGetTokens(Array.from(uniqueTokenIds)) : await getTokenVMs(Array.from(uniqueTokenIds))
    :
    [];

  // Create an id to token map so that we can extrapolate the user info for the UI
  const tokenMap = tokens.reduce((map, token) => {
    map[token.id] = token;
    return map;
  }, {});

  // The final result we'll give back to the FE
  const result = actions.map(action => {

    const actionVM: HodlActionViewModel = {
      id: action.id,
      user: userMap[action.subject],
      timestamp: action.timestamp,
      object: action.object,
      objectId: action.objectId,
      action: action.action,
      subject: action.subject,
      metadata: action.metadata || null
    };

    if (action.object === "token") {
      actionVM.token = tokenMap[action.objectId];
    }

    if (action.object === "comment") {
      const comment = commentMap[action.objectId];
      actionVM.comment = comment || null;

      if (comment) {
        // We also retrieved the token the comment was about (as we use the image in the notifications box)
        actionVM.token = tokenMap[comment.tokenId];
      }
    }

    return actionVM;
  });

  return {
    items: result,
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

  const actions = await getActions(req.address, set as ActionSet, +offset, +limit);

  res.status(200).json(actions);
});


export default route;
