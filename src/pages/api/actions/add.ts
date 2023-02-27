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
import { getAction } from ".";
import { pusher } from "../../../lib/server/pusher";
import { runRedisTransaction } from "../../../lib/database/rest/databaseUtils";
import axios from "axios";
import { getComment } from "../../../lib/database/rest/getComment";
import { getListingFromBlockchain } from "../contracts/market/listing/[tokenId]";
import { getTokenFromBlockchain } from "../contracts/token/[tokenId]";
import { addToZeplo } from "../../../lib/addToZeplo";

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
    } catch (e) {
      // We do not want to retry the whole actions system if this fails; as it will populate the database with duplicate actions
      // TODO: We should split the 'notifications' out into their own sub-system so that we can retry them without impacting the actions

      // if this DOES fail at the moment; the user WILL still get a notification. It just won't be 'real-time'
      console.log(e);
    }
  }

  return success;
}


// gets the last <x> actions that address took that can be used in a feed
const getLastXFeedActions = async (address: string, x: number = 5): Promise<HodlAction[]> => {
  const actionIds = await client.zrange(`user:${address}:actions:feed`, 0, x, { rev: true });

  const params = actionIds.map(id => `action:${id}`)
  const actions: HodlAction[] = params.length ? await client.mget(...params) : [];

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

  if (action.action === ActionTypes.Liked) { // tell the token owner you liked it
    if (action.object === "token") {

      const likes = await likesToken(action.subject, action.objectId);
      if (!likes) {
        return;
      }

      // We just use the cache value here; as the worst thing that could happen is we tell
      // the old owner that someone liked their token if the cache is a little stale.
      const mutableToken = await getMutableToken(action.objectId);

      if (!mutableToken || mutableToken.hodler === action.subject) {
        return; // We've liked our own token. No need for a notification.
      }

      return await addNotification(mutableToken.hodler, action);

    } else if (action.object === "comment") {

      const likes = await likesComment(action.subject, action.objectId);
      if (!likes) {
        return;
      }

      const comment: HodlComment = await getComment(action.objectId);

      if (action.subject === comment.subject) {
        return; // We've liked our own comment. No need for a notification.
      }

      return await addNotification(comment.subject, action);
    }
  }

  if (action.action === ActionTypes.Tagged) {
    if (!action?.metadata?.address) {
      return;
    }
    return await addNotification(action.metadata.address, action);
  }

  // Who: 
  // The token author if the action is about a token; or 
  // the comment author if the action is about the comment; or
  // any user who has been 'tagged' in the comment
  if (action.action === ActionTypes.Commented) {

    const comment: HodlComment = await getComment(action.objectId);

    // Tagged...
    const mentionedInComment = Array.from(new Set(comment.comment.match(/0x[A-Fa-f0-9]{40}/g)));

    for (let address of mentionedInComment) {
      // subject tagged metadata.address in a comment
      const tagged = {
        subject: action.subject,
        action: ActionTypes.Tagged,
        object: "comment",
        objectId: comment.id,
        metadata: {
          address // The person tagged
        }
      };
  
      addToZeplo(
        'api/actions/add',
        tagged,
      );
    }
  
    if (comment?.object === "token") { // the comment was about a token, tell the token owner.

      // We just use the cache value here; as the worst thing that could happen is we tell
      // the old owner that someone commented on their token if our cache is a little stale.
      const mutableToken = await getMutableToken(comment.tokenId);

      if (!mutableToken || mutableToken.hodler === action.subject) {
        return; // We've commented on our own token. No need for a notification.
      }

      return await addNotification(mutableToken.hodler, action);
    } else if (comment?.object === "comment") { // the comment was a reply, tell the comment author. 
      const commentThatWasRepliedTo: HodlComment = await getComment(comment.objectId);

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

    if (lastActions.length) {
      const timeStampAndActions = lastActions.flatMap(action => [action.timestamp, action.id]);

      const cmds = [
        ['ZADD', `user:${user}:feed`, ...timeStampAndActions],
        ["ZREMRANGEBYRANK", `user:${user}:feed`, 0, -(500 + 1)]
      ];

      const success = await runRedisTransaction(cmds);

      if (success) {
        try {
          pusher.sendToUser(user, "feed", null); // we want the ui to update when the user has followed someone; so they can immediately see their content
        } catch (e) {
          console.log(e);
        }
      }
    }

    // tell <followed>, that <user> followed them
    return await addNotification(`${followed}`, action);
  }

  // Who: 
  // Tell the seller their token is now listed on the market
  // Tell the seller's followers there's a new token on the market
  if (action.action === ActionTypes.Listed) {
    try {
      // Sanity check: Read the blockchain to ensure what we are about to do is correct
      const listing = await getListingFromBlockchain(+action.objectId);

      if (listing === null) {
        console.log('actions/listed - token is not listed on the market. not updating actions');
        return true;
      }

      // We could also check the action.subject matches the token owner. Possibly not worth the performance hit though, as 
      // the actions system is not callable by users

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
      // Sanity check: Read the blockchain to ensure what we are about to do is correct
      const listing = await getListingFromBlockchain(+action.objectId);

      if (listing !== null) {
        console.log('actions/delisted - token is still for sale on the market. not updating actions');
        return true;
      }

      // We could also check the action.subject matches the token owner. Possibly not worth the performance hit though, as 
      // the actions system is not callable by users

      await addNotification(action.subject, action);
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
    // Sanity check: Read the blockchain to ensure what we are about to do is correct
    const listing = await getListingFromBlockchain(+action.objectId);

    if (listing !== null) {
      console.log('actions/bought - token is still for sale on the market. not updating actions');
      return true;
    }

    // We could also check the action.subject matches the token owner. Possibly not worth the performance hit though, as 
    // the actions system is not callable by users

    await addNotification(`${action.subject}`, action);
    await addNotification(`${action.metadata.seller}`, action);

    return;
  }

  // Who: 
  // Tell the seller their token is now on hodlmymoon
  // Tell the seller's followers there's a new token on hodlmymoon
  if (action.action === ActionTypes.Added) {
    try {
      // Sanity check: Read the blockchain to ensure what we are about to do is correct
      const { ownerOf } = await getTokenFromBlockchain(+action.objectId);

      if (ownerOf !== action.subject) {
        console.log('actions/added - token owner is different to the action subject. not updating actions');
        return true;
      }

      await addNotification(`${action.subject}`, action);
      await addToFeedOfFollowers(action);

      return;
    } catch (e) {
      return;
    }
  }

  return;
}


// We do sanity checks against the blockchain for any 'web3' actions
// For 'web2' actions; we just consult the cache.
// We sync the cache pretty well for onsite stuff; anything that happens off-site could in theory
// be a little stale; although I don't think the user will be able to like or comment on a token
// that's not been recached yet; so we probably good.
route.post(async (req, res: NextApiResponse) => {
  if (req.query.secret !== process.env.ZEPLO_SECRET) {
    console.log("actions/add - endpoint not called via our message queue");
    return res.status(401).json({ message: 'unauthenticated' });
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

  const { subject, action, object, objectId, metadata } = body;

  if (!subject || !action || !object || !objectId) {
    // We'd normally say this is a 400, however this is used in a zeplo pipeline
    // and if we give back a 400, zeplo will retry it
    //
    // in the case of a rejected transaction, there's no action to add to the system
    // and in cases where we are missing action, object, or objectId there would be no point
    // in retrying as we wouldn't be able to handle it
    console.log("actions/add - Incomplete action sent. Not processing", body);
    return res.status(200).json({ message: 'Incomplete action sent. Not processing' });
  }

  await addAction({
    subject,
    action,
    objectId,
    object,
    metadata
  });

  return res.status(200).json({ message: 'success' });
});


export default route;
