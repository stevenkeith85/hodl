import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import apiRoute from "../handler";
import { ActionSet, ActionSetMembers, ActionTypes, HodlAction } from '../../../models/HodlAction';
import { likesToken } from "../like/token/likes";
import { getFollowersAddresses } from "../followers";
import { isFollowing } from "../follows";
import { likesComment } from "../like/comment/likes";
import { getMutableToken } from "../contracts/mutable-token/[tokenId]";
import { HodlComment } from "../../../models/HodlComment";
import { MutableToken } from "../../../models/Nft";
import { getAction } from ".";
import { pusher } from "../../../lib/server/pusher";
import { runRedisTransaction } from "../../../lib/database/rest/databaseUtils";
import axios from "axios";

const route = apiRoute();
const client = Redis.fromEnv()

// Data Structures:
//
// Actions are stored as JSON with a STRING mapping
//
// "action:1" -> "{ id, subject, object, objectId, timestamp }", 
// "action:2" -> "{ id, subject, object, objectId, timestamp }", 
// 
// The ZSET of actions THE USER HAS TAKEN
// "user:0x1234:actions" -> (<action_id>/<timestamp>, <action_id>/<timestamp>, <action_id>/<timestamp>)
//
// The ZSET of FEED actions THE USER HAS TAKEN
// "user:0x1234:actions:feed" -> (<action_id>/<timestamp>, <action_id>/<timestamp>, <action_id>/<timestamp>)
//
// The ZSET of notifications FOR THE USER:
// "user:0x1234:notifications" -> (<action_id>/<timestamp>, <action_id>/<timestamp>, <action_id>/<timestamp>)
//
// The ZSET of feed items FOR THE USER:
// "user:0x1234:feed" -> (<action_id>/<timestamp>, <action_id>/<timestamp>, <action_id>/<timestamp>)
//


// Add the action id to <address>s notifications
const addNotification = async (address: string, action: HodlAction): Promise<boolean> => {

  const cmds = [
    ['ZADD', `user:${address}:notifications`, action.timestamp, action.id],
    ["ZREMRANGEBYRANK", `user:${address}:notifications`, 0, -(500 + 1)]
  ];

  const success = await runRedisTransaction(cmds);

  if (success) {
    try {
      const promises = [
        pusher.sendToUser(address, "notification", null),
        pusher.sendToUser(address, "notification-hover", await getAction(action.id, null))
      ];

      await Promise.all(promises);
    } catch(e) {
      // We do not want to retry the whole actions system if this fails; as it will populate the database with duplicate actions
      // TODO: We should split the 'notifications' out into their own sub-system so that we can retry them without impacting the actions
      
      // if this DOES fail at the moment; the user WILL still get a notification. It just won't be 'real-time'
      console.log(e);
    }
  }

  return success;
}

// Add the action id to <address>s feed. We'll set the feed entry's timestamp to use the action's timestamp (for now)
// as we'd probably not want to show something at the top of a chronological feed, if it was actually listed a while ago
const addToFeed = async (address: string, action: HodlAction): Promise<boolean> => {

  const cmds = [
    ['ZADD', `user:${address}:feed`, action.timestamp, action.id],
    ["ZREMRANGEBYRANK", `user:${address}:feed`, 0, -(500 + 1)]
  ];

  const success = await runRedisTransaction(cmds);

  return success;
}

// gets the last <x> actions that address took that can be used in a feed
const getLastXFeedActions = async (address: string, x: number = 5): Promise<HodlAction[]> => {
  const actionIds = await client.zrange(`user:${address}:actions:feed`, 0, x, { rev: true });

  const actions: HodlAction[] = [];

  for (const id of actionIds) {
    const data: HodlAction = await client.get(`action:${id}`);

    // If the set has an id of an action that no longer exists, then we do not want to add it.
    // Ideally, we'd never be in this situation
    if (data) {
      actions.push(data);
    }
  }

  return actions;
}


const addToFeedOfFollowers = async (action: HodlAction) => {
  // TODO: Optimise this as the user could have millions of followers.
  // and our serverless function would time out

  // TODO: We might want to performance test this and limit the total number
  // of feeds we add to until we are sure we can handle an unlimited number

  const offset = 0
  const limit = 1000;

  // get initial page
  let { items, next, total } = await getFollowersAddresses(action.subject, offset, limit);

  do {
    const cmds = [];

    for (let address of items) {
      cmds.push(
        ['ZADD', `user:${address}:feed`, action.timestamp, action.id],
        ["ZREMRANGEBYRANK", `user:${address}:feed`, 0, -(500 + 1)]
      );
    }

    await runRedisTransaction(cmds);


    // update page
    let followers = await getFollowersAddresses(action.subject, next, limit);
    items = followers.items;
    next = followers.next;
    total = followers.total;

  } while (next <= total); // if next exceeds total, then we've reached the end

  return true;
}



// This is the entry point ot the actions system, that will also add the appropriate feed item or notification
//
// TODO: We'd likely want to retry this if its not successful.
// Need to figure out the specifics though. (which may differ for each action)
export const addAction = async (action: HodlAction) => {

  // TODO: This could in-theory get orphaned if the transaction doesn't go through.
  // Not the end of the world, but would be nice if that didn't happen
  const actionId = await client.incr("actionId");

  action.id = actionId;
  action.timestamp = Date.now();

  const multiExecCmds = [
    // Add the action record
    ['SET', `action:${action.id}`, JSON.stringify(action)],

    // Update the users actions set
    ['ZADD', `user:${action.subject}:actions`, action.timestamp, action.id]
  ];

  // If its a feed action, add it to the users feed set.
  // We look this up when they are followed; to get content for the followers feed
  if (ActionSetMembers[ActionSet.Feed].indexOf(action.action) !== -1) {
    multiExecCmds.push(
      ['ZADD', `user:${action.subject}:actions:feed`, action.timestamp, action.id]
    )
  }

  const success = await runRedisTransaction(multiExecCmds);

  if (!success) {
    return; // TODO: Handle this
  }

  // console.log('added action with id', action.id)
  // console.log('actions/add - Stored Action');

  if (action.action === ActionTypes.Liked) { // tell the token owner you liked it
    if (action.object === "token") {

      const likes = await likesToken(action.subject, action.objectId);
      if (!likes) {
        return;
      }

      // Potentially, we might be safe to just read our cached value here
      // if our cache update strategy is bulletproof.
      const mutableToken = await getMutableToken(action.objectId, true);

      if (mutableToken.hodler === action.subject) {
        return; // We've liked our own token. No need for a notification.
      }

      return await addNotification(mutableToken.hodler, action);

    } else if (action.object === "comment") {

      const likes = await likesComment(action.subject, action.objectId);
      if (!likes) {
        return;
      }

      const comment: HodlComment = await client.get(`comment:${action.objectId}`);

      if (action.subject === comment.subject) {
        return; // We've liked our own comment. No need for a notification.
      }

      return await addNotification(comment.subject, action);
    }
  }

  // Who: The token author if the action is about a token; or the comment author if the action is about the comment
  if (action.action === ActionTypes.Commented) {

    const comment: HodlComment = await client.get(`comment:${action.objectId}`);

    if (comment?.object === "token") { // the comment was about a token, tell the token owner.
      // Potentially, we might be safe to just read our cached value here
      // if our cache update strategy is bulletproof.
      const mutableToken = await getMutableToken(comment.tokenId, true);

      if (mutableToken.hodler === action.subject) {
        return; // We've commented on our own token. No need for a notification.
      }

      console.log(`actions/add - adding a notification for ${mutableToken.hodler}, as someone commented on their token`)
      return await addNotification(mutableToken.hodler, action);
    } else if (comment?.object === "comment") { // the comment was a reply, tell the comment author. 
      const commentThatWasRepliedTo: HodlComment = await client.get(`comment:${comment.objectId}`);

      if (action.subject === commentThatWasRepliedTo.subject) {
        return; // We've replied to our own comment. No need for a notification.
      }

      return await addNotification(commentThatWasRepliedTo.subject, action);
    }
  }

  if (action.action === ActionTypes.Followed) { // tell the account someone followed it
    const user = action.subject;
    const followed = action.objectId;

    // verify this
    const follows = await isFollowing(user, followed);
    if (!follows) {
      return;
    }

    // get the last few actions <followed> took, 
    // and add it to the <user>s feed
    const lastActions = await getLastXFeedActions(followed as string)

    for (const a of lastActions) {
      await addToFeed(`${user}`, a);
    }

    // tell <followed>, that <user> followed them
    return await addNotification(`${followed}`, action);
  }

  // Who: 
  // Tell the seller their token is now listed on the market
  // Tell the seller's followers there's a new token on the market
  if (action.action === ActionTypes.Listed) {
    try {
      // This also updates the cache for us :)
      const token: MutableToken = await getMutableToken(+action.objectId, true);

      if (token.hodler !== action.subject) {
        return;
      }

      if (!token.forSale) {
        return;
      }

      // Notify the user their token has made it onto the market
      await addNotification(action.subject, action);
      await addToFeedOfFollowers(action);

      return;
    } catch (e) {
      return;
    }
  }

  // Who: Tell the seller's followers (via their feed) there's no longer a new token for sale
  if (action.action === ActionTypes.Delisted) {
    try {
      const token: MutableToken = await getMutableToken(+action.objectId, true);

      if (token.hodler !== action.subject) {
        return;
      }

      if (token.forSale) {
        return;
      }

      await addNotification(action.subject, action);
      await addToFeedOfFollowers(action);

      return;
    } catch (e) {
      return;
    }
  }


  // Who: 
  // Tell the seller their token is now on hodlmymoon
  // Tell the seller's followers there's a new token on hodlmymoon
  if (action.action === ActionTypes.Added) {
    try {
      // This also caches it for us :)
      const token: MutableToken = await getMutableToken(+action.objectId, true);

      if (token.hodler !== action.subject) {
        return;
      }

      await addNotification(`${action.subject}`, action);
      await addToFeedOfFollowers(action);

      return;
    } catch (e) {
      return;
    }
  }

  // Who: 
  // Tell the seller they've sold a token
  // Tell the buyer they've bought a token
  if (action.action === ActionTypes.Bought) {
    // This also caches it for us :)
    const token: MutableToken = await getMutableToken(+action.objectId, true);

    if (token.hodler !== action.subject) {
      return;
    }

    if (token.forSale) {
      return;
    }

    await addNotification(`${action.subject}`, action);
    await addNotification(`${action.metadata.seller}`, action);

    return;
  }

  return;
}


// TODO: Most actions are now added by our tx handlers; 

// Adding a comment isn't; and it consults the blockchain; so it is pretty slow.
// We either need to consult a cache (fast but possibly inaccurate); or move the actions stuff to a message queue

route.post(async (req, res: NextApiResponse) => {
  if (req.query.secret !== process.env.ZEPLO_SECRET) {
    console.log("actions/add - endpoint not called via our message queue");
    return res.status(401).json({ message: 'unauthenticated' });
  }

  // We also require the user to be authenticated; so they'll need to have their access/refresh cookies forwarded
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  let body = req.body;

  const inputFromPreviousStep = req.headers['x-zeplo-step-a'];

  if (inputFromPreviousStep) {
    try {
      const url = `https://zeplo.to/requests/${inputFromPreviousStep}/response.body?_token=${process.env.ZEPLO_TOKEN}`;
      const { data } = await axios.get(url);
      body = data;
    } catch (e) {
      console.log('zeplo.io/requests did not return the data', e.message);
      return res.status(501).json({ message: 'Downstream Server Issue' })
    }
  }

  const { action, object, objectId, metadata } = body;

  if (!action || !object || !objectId) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  await addAction({
    subject: req.address,
    action,
    objectId,
    object,
    metadata
  });

  return res.status(200).json({ message: 'success' });
});


export default route;
