import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import apiRoute from "../handler";
import { ActionSet, ActionSetMembers, ActionTypes, HodlAction } from '../../../models/HodlAction';
import { getPriceHistory } from "../contracts/market/events/token-bought/[tokenId]";
import { likesToken } from "../like/token/likes";
import { getFollowers } from "../followers";
import { isFollowing } from "../follows";
import { likesComment } from "../like/comment/likes";
import { fetchNFT, getHodlerAddress } from "../nft/[tokenId]";
import { HodlComment } from "../../../models/HodlComment";

import { Nft } from "../../../models/Nft";
import { getUser } from "../user/[handle]";

import { getAction } from ".";
import { pusher } from "../../../lib/server/pusher";
import { trimZSet } from "../../../lib/databaseUtils";

import { createHmac } from "crypto";
import { User } from "../../../models/User";


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
//
// The ZSET of notifications FOR THE USER:
// "user:0x1234:notifications" -> (<action_id>/<timestamp>, <action_id>/<timestamp>, <action_id>/<timestamp>)
//
// The ZSET of feed items FOR THE USER:
// "user:0x1234:feed" -> (<action_id>/<timestamp>, <action_id>/<timestamp>, <action_id>/<timestamp>)
//

// Add the action id to <address>s notifications
const addNotification = async (address: string, action: HodlAction): Promise<number> => {
  const added = await client.zadd(
    `user:${address}:notifications`,
    {
      score: action.timestamp,
      member: action.id
    }
  );

  await trimZSet(client, `user:${address}:notifications`);

  if (added) {
    console.log(`actions/add/addNotification - sending ${address} push notifications.`);

    const notification = await pusher.sendToUser(address, "notification", null);
    if (!notification.ok) {
      console.log(`actions/add/addNotification - pusher was unable to send <notification> to user`);
    }

    const notificationHover = await pusher.sendToUser(address, "notification-hover", await getAction(action.id, null));
    if (!notificationHover.ok) {
      console.log(`actions/add/addNotification - pusher was unable to send <notification-hover> to user`);
    }
  }

  return added;
}

// Add the action id to <address>s feed. We'll set the feed entry's timestamp to use the action's timestamp (for now)
// as we'd probably not want to show something at the top of a chronological feed, if it was actually listed a while ago
const addToFeed = async (address: string, action: HodlAction): Promise<number> => {
  const added = await client.zadd(
    `user:${address}:feed`,
    {
      score: action.timestamp,
      member: action.id
    }
  );

  await trimZSet(client, `user:${address}:feed`);

  if (added) {
    pusher.sendToUser(address, "feed", null);
  }

  return added;
}

// Add the action's id to <address>s set.
// 
// We need this, for scenarios like:
// When A follows B, we'd like to add B's last action to A's feed (if it's not already there)
//
// We could also provide a general activity log at some point for the user/address. (if that's a feature they'd like)
const recordAddressActivity = async (action: HodlAction): Promise<number> => {
  // actions the user has taken
  const added = await client.zadd(
    `user:${action.subject}:actions`,
    {
      score: action.timestamp,
      member: action.id
    }
  );

  // if this is a feed action, record it here.
  //
  // we will use this to get some content for
  // a (different) user's feed if they follow this user in the future
  if (ActionSetMembers[ActionSet.Feed].indexOf(action.action) !== -1) {
    await client.zadd(
      `user:${action.subject}:actions:feed`,
      {
        score: action.timestamp,
        member: action.id
      }
    );
  }

  return added;
}


// actions could be referenced (by id) from several places.
const storeAction = async (action: HodlAction): Promise<string | HodlAction | null> => {
  return await client.set(`action:${action.id}`, action);
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


  // We want followers to be notified as close together as possible.
  // We'll probably switch to doing the add to feed via the user's message queue.
  // The have one for transactions; but perhaps an alternative one for web2 stuff

  const offset = 0
  const limit = 1;

  // get initial page
  let { items, next, total } = await getFollowers(action.subject, offset, limit);

  do {
    let promises = [];

    for (let follower of items) {
      console.log('adding to feed of', follower)
      const promise = addToFeed(`${follower.address}`, action);
      promises.push(promise);
    }

    await Promise.all(promises);

    // update page
    let followers = await getFollowers(action.subject, next, limit);
    items = followers.items;
    next = followers.next;
    total = followers.total;

  } while (next <= total); // if next exceeds total, then we've reached the end



  // console.log('actions/add/addToFeedOfFollowers - end of batch - followers, next, total', followers, next, total);


  return 1; // TODO: We want to return how many followers were notified here
}


// This is the entry point ot the actions system, that will also add the appropriate feed item or notification
//
// TODO: Handle 'near duplicates' better.
// i.e user toggles the like button a few times === steven liked token 2 (2 mins ago). steven liked token 2 (1 min ago)
export const addAction = async (action: HodlAction): Promise<number> => {
  action.timestamp = Date.now();

  // TODO: REDIS TRANSACTION
  const actionId = await client.incr("actionId")
  action.id = actionId;

  await storeAction(action);
  await recordAddressActivity(action);

  if (action.action === ActionTypes.Liked) { // tell the token owner you liked it
    if (action.object === "token") {

      const likes = await likesToken(action.subject, action.objectId);
      if (!likes) {
        return;
      }

      const owner = await getHodlerAddress(action.objectId);

      if (owner === action.subject) {
        return; // We've liked our own token. No need for a notification.
      }

      return await addNotification(owner, action);

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
      const hodler = await getHodlerAddress(comment.tokenId);

      if (hodler === action.subject) {
        return; // We've commented on our own token. No need for a notification.
      }

      console.log(`actions/add - adding a notification for ${hodler}, as someone commented on their token`)
      return await addNotification(hodler, action);
    } else if (comment?.object === "comment") { // the comment was a reply, tell the comment author. 
      const commentThatWasRepliedTo: HodlComment = await client.get(`comment:${comment.objectId}`);

      if (action.subject === commentThatWasRepliedTo.subject) {
        return; // We've replied to our own comment. No need for a notification.
      }

      console.log(`actions/add - adding a notification for ${(await getUser(commentThatWasRepliedTo.subject, null)).nickname}, as someone replied to their comment`)
      return await addNotification(commentThatWasRepliedTo.subject, action);
    }

    pusher.trigger('comments', 'new', null);
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

  // Who: Tell the seller's followers (via their feed) there's a new token for sale
  if (action.action === ActionTypes.Listed) {
    try {
      const token: Nft = await fetchNFT(+action.objectId);

      if (!token.forSale) {
        return;
      }

      if (token.owner !== action.subject) {
        return;
      }

      // Blockchain transactions could take a little time; so we need to notify the user their token has made it onto the market
      await addNotification(action.subject, action);

      const count = await addToFeedOfFollowers(action);

      return count;
    } catch (e) {
      return 0;
    }
  }

  // Who: Tell the seller's followers (via their feed) there's no longer a new token for sale
  if (action.action === ActionTypes.Delisted) {
    try {
      const token: Nft = await fetchNFT(+action.objectId);

      if (token.forSale) {
        console.log('actions/add/delisted - validation failed: token is still for sale')
        return;
      }

      if (token.owner !== action.subject) {
        console.log('actions/add/delisted - validation failed: token owner should be the same as the action subject')
        return;
      }

      console.log('actions/add/delisted - adding to followers feeds')

      // Blockchain transactions could take a little time; so we need to notify the user their token has been taken off the market
      await addNotification(action.subject, action);

      const count = await addToFeedOfFollowers(action);

      return count;
    } catch (e) {
      return 0;
    }
  }


  // Who: Tell the seller's followers (via their feed) there's a new token on the site
  if (action.action === ActionTypes.Added) {
    try {
      const token: Nft = await fetchNFT(+action.objectId);

      if (token.owner !== action.subject) {
        return;
      }

      // TODO: Possibly don't need to wait here. i.e. we could prevent the UI hanging by doing this async?
      await addNotification(`${action.subject}`, action);
      const count = await addToFeedOfFollowers(action);

      return count;
    } catch (e) {
      return 0;
    }
  }

  // Who: Tell the user they've sold their token
  if (action.action === ActionTypes.Bought) {

    const history = await getPriceHistory(action.objectId);

    if (history.length === 0) {
      console.log(`actions/add/bought - cannot find price history. cannot verify`)
      return 0;
    }

    console.log(`actions/add/bought - token price history === `, history)

    const buyer = history[history.length - 1].buyerAddress;
    const seller = history[history.length - 1].sellerAddress;

    if (buyer !== action.subject) {
      console.log(`actions/add/bought - buyer ${buyer}does not match the action subject ${action.subject}`)
      return;
    }

    await client.set(`action:${action.id}`, action);

    const first = await addNotification(`${buyer}`, action);
    const second = await addNotification(`${seller}`, action);

    return first + second;
  }

  return 0;
}


// TODO: Most actions are now added by our tx handlers; 

// Adding a comment isn't; and it consults the blockchain; so it is pretty slow.
// We either need to consult a cache (fast but possibly inaccurate); or move the actions stuff to a message queue

route.post(async (req, res: NextApiResponse) => {

  // We only accept requests that came via our message queue. 
  // You need our API key to add something to the queue, so this adds a layer of security
  const payload = JSON.stringify({ target: `https://${process.env.VERCEL_URL || process.env.MESSAGE_HANDLER_HOST}/api/actions/add`});
  const signature = createHmac("sha256", process.env.SERVERLESSQ_API_TOKEN)
    .update(payload)
    .digest("hex");

  if (signature !== req.headers['x-serverlessq-signature']) {
    console.log('api/actions - Request did not come via message queue')
    return res.status(403).json({ message: "Not Authenticated" });
  }

  // We also require the user to be authenticated; so they'll need to have their access/refresh cookies forwarded
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { action, object, objectId } = req.body;

  if (!action || !object || !objectId) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  // We only accept certain actions at the moment.
  if (action !== ActionTypes.Commented && 
      action !== ActionTypes.Liked &&
      action !== ActionTypes.Followed) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  // Create the action.
  // For any blockchain actions, we will also consult the live blockchain in the addAction function; to further lock things down.
  const success = await addAction({
    subject: req.address,
    action,
    objectId,
    object
  });

  if (success) {
    console.log('api/actions - successfully processed action for', req.address)
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(200).json({ message: 'action not processed' });
  }
});


export default route;
