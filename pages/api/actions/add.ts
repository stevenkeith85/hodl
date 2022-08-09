import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import axios from 'axios';
import apiRoute from "../handler";
import { ActionSet, ActionSetMembers, ActionTypes, HodlAction } from '../../../models/HodlAction';
import { getPriceHistory } from "../token-bought/[tokenId]";
import { likesToken } from "../like/token/likes";
import { getFollowers } from "../followers";
import { isFollowing } from "../follows";
import { likesComment } from "../like/comment/likes";
import { fetchNFT, getOwnerOrSellerAddress } from "../nft/[tokenId]";
import { HodlComment } from "../../../models/HodlComment";
import { ethers } from "ethers";
import { nftaddress } from "../../../config";
import { getProvider } from "../../../lib/server/connections";
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';

import { Nft } from "../../../models/Nft";
import { Token } from "../../../models/Token";
import { getUser } from "../user/[handle]";
import { getComment } from "../comment";

dotenv.config({ path: '../.env' })
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
// TODO: We may want to trim this set as it is queried from the FE. Possibly we archive the data?
const addNotification = async (address: string, action: HodlAction): Promise<number> => {
  const added = await client.zadd(
    `user:${address}:notifications`,
    {
      score: action.timestamp,
      member: action.id
    }
  );

  return added;
}

// Add the action id to <address>s feed. We'll set the feed entry's timestamp to use the action's timestamp (for now)
// as we'd probably not want to show something at the top of a chronological feed, if it was actually listed a while ago

// TODO: We may want to trim this set as it is queried from the FE. Possibly we archive the data?
const addToFeed = async (address: string, action: HodlAction): Promise<number> => {
  const added = await client.zadd(
    `user:${address}:feed`,
    {
      score: action.timestamp,
      member: action.id
    }
  );

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
const storeAction = async (action: HodlAction): Promise<string | null> => {
  return await client.set(`action:${action.id}`, JSON.stringify(action));
}

// gets the last <x> actions that address took that can be used in a feed
const getLastXFeedActions = async (address: string, x: number = 5): Promise<HodlAction[]> => {
  const r = await axios.get(`${process.env.UPSTASH_REDIS_REST_URL}/zrange/user:${address}:actions:feed/0/${x}/rev`, {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
    }
  })
  const actionIds = r.data.result.map(item => JSON.parse(item));

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
  // TODO: Optimise this as user could have millions of followers
  // TEMP FIX: Only tell the first X followers :(
  // We actually want this to happen in parallel if possibly. Otherwise one follower
  // might get notified way ahead of another, which could be an advantage for them
  const { items: followers } = await getFollowers(action.subject, 0, 10000);

  let count = 0;
  for (let follower of followers) {
    count += await addToFeed(`${follower.address}`, action);
  }

  return count;
}


// This is the entry point ot the actions system, that will also add the appropriate feed item or notification
//
// TODO: Handle 'near duplicates' better.
// i.e user toggles the like button a few times === steven liked token 2 (2 mins ago). steven liked token 2 (1 min ago)
export const addAction = async (action: HodlAction) => {
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

      const owner = await getOwnerOrSellerAddress(action.objectId);

      // THIS IS TEMP. MAKES IT EASIER TO DEBUG
      // await addNotification(action.subject, action);

      return await addNotification(owner, action);

    } else if (action.object === "comment") {

      const likes = await likesComment(action.subject, action.objectId);
      if (!likes) {
        return;
      }

      const comment: HodlComment = await client.get(`comment:${action.objectId}`);

      return await addNotification(comment.subject, action);
    }
  }

  // Who: The token author if the action is about a token; or the comment author if the action is about the comment
  if (action.action === ActionTypes.Commented) {

    const comment: HodlComment = await client.get(`comment:${action.objectId}`);

    if (comment?.object === "token") { // the comment was about a token, tell the token owner.
      const owner = await getOwnerOrSellerAddress(comment.tokenId);

      // TODO: perhaps we should start logging this sort of thing?
      console.log(`adding a notification for ${(await getUser(owner)).nickname}, as someone commented on their token`)
      return await addNotification(owner, action);
    } else if (comment?.object === "comment") { // the comment was a reply, tell the comment author. 
      const commentThatWasRepliedTo: HodlComment = await client.get(`comment:${comment.objectId}`);

      // TODO: perhaps we should start logging this sort of thing?
      console.log(`adding a notification for ${(await getUser(commentThatWasRepliedTo.subject)).nickname}, as someone replied to their comment`)
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

      // TODO: Possibly don't need to wait here. i.e. we could prevent the UI hanging by doing this async?
      const count = await addToFeedOfFollowers(action);

      return count;
    } catch (e) {
      return 0;
    }
  }

  // TODO: Debug this. I don't think its adding it to the followers feed
  // Who: Tell the seller's followers (via their feed) there's a new token on the site
  if (action.action === ActionTypes.Added) {
    try {
      const token: Nft = await fetchNFT(+action.objectId);

      if (token.owner !== action.subject) {
        return;
      }

      // // might need to think about this. user could have millions of followers
      // // just do the most recent 10,000 at the moment
      // const {items: followers} = await getFollowers(action.subject, 0, 10000); 

      // let count = 0;
      // for (let follower of followers) {
      //   count += await addToFeed(`${follower.address}`, action);
      // }

      // TODO: Possibly don't need to wait here. i.e. we could prevent the UI hanging by doing this async?
      const count = await addToFeedOfFollowers(action);

      return count;
    } catch (e) {
      return 0;
    }
  }

  // Who: Tell the buyer and seller the sale happened
  if (action.action === ActionTypes.Bought) {

    const history = await getPriceHistory(action.objectId);

    if (history.length === 0) {
      return 0;
    }

    const buyer = history[0].buyerAddress;
    const seller = history[0].sellerAddress;

    if (buyer !== action.subject) {
      return;
    }

    const first = await addNotification(`${buyer}`, action);
    const second = await addNotification(`${seller}`, action);

    return first + second;
  }

  return 0;
}

// TODO: We may need to revisit how these notifications get added. 
// Perhaps a standalone service that monitors blockchain events; rather than the user's browser informing us.
// Maybe qStash ?
route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { action, object, id } = req.body;

  if (!action || !object || !id) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  // Block most actions in the API, as we don't need these to be directly called client-side.
  // This reduces likelihood of bots posting misleading notifications / lies).
  // We do check the validity of a notification though before adding it...
  if (action !== ActionTypes.Listed && action !== ActionTypes.Bought) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  if (object !== "token") {
    return res.status(400).json({ message: 'Bad Request' });
  }

  // Ensure the token actually exists
  const provider = await getProvider();
  const contract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
  const tokenExists = await contract.exists(id);

  if (!tokenExists) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const notification: HodlAction = {
    subject: req.address,
    action,
    objectId: id,
    object
  };

  const success = await addAction(notification);

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(200).json({ message: 'notification not added' });
  }
});


export default route;
