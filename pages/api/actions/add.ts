import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

const client = Redis.fromEnv()
import apiRoute from "../handler";
import { ActionTypes, HodlAction } from '../../../models/HodlAction';
import { getPriceHistory } from "../token-bought/[tokenId]";
import { likesToken } from "../like2/token/likes";
import { getFollowers } from "../follow2/followers";
import { isFollowing } from "../follow2/follows";
import { likesComment } from "../like2/comment/likes";
import { fetchNFT, getOwnerOrSellerAddress } from "../nft/[tokenId]";
import { HodlComment } from "../../../models/HodlComment";
import { ethers } from "ethers";
import { nftaddress } from "../../../config";
import { getProvider } from "../../../lib/server/connections";
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';

import { Nft } from "../../../models/Nft";

dotenv.config({ path: '../.env' })
const route = apiRoute();

// Data Structures:
//
// The hash containing every action made on HodlMyMoon (we only record what is necessary; i.e. we aren't a data farm)
//
// "action" -> {
//   1: "{ id, subject, object, objectId, timestamp }", 
//   2: "{ id, subject, object, objectId, timestamp }", 
// }
//
// The sorted set of notifications for the user:
// "notifications:0x1234" -> (<action_id>/<timestamp>, <action_id>/<timestamp>, <action_id>/<timestamp>)
//
// The sorted set of feed items for the user:
// "feed:0x1234" -> (<action_id>/<timestamp>, <action_id>/<timestamp>, <action_id>/<timestamp>)
//
// The sorted set of actions/activity for the user:
// "actions:0x1234" -> (<action_id>/<timestamp>, <action_id>/<timestamp>, <action_id>/<timestamp>)


// Add the action id to <address>s notifications
const addNotification = async (address: string, action: HodlAction) : Promise<number> => {
  const added = await client.zadd(
    `notifications:${address}`,
    {
      score: action.timestamp,
      // member: JSON.stringify(action)
      member: action.id
    }
  );

  return added;
}

// Add the action id to <address>s feed. We'll set the feed entry's timestamp to use the action's timestamp (for now)
// as we'd probably not want to show something at the top of a chronological feed, if it was actually listed a while ago
const addToFeed = async (address: string, action: HodlAction) : Promise<number> => {
  const added = await client.zadd(
    `feed:${address}`,
    {
      score: action.timestamp,
      // member: JSON.stringify(action)
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
// We could also provide a general activity log at some point for the user/address.
const recordAddressActivity = async (action: HodlAction) : Promise<number> => {
  const added = await client.zadd(
    `actions:${action.subject}`,
    {
      score: action.timestamp,
      member: action.id
    }
  );

  return added;
}


// actions could be referenced (by id) from several places.
const storeAction = async (action: HodlAction) : Promise<number> => {
  const added = client.hset(
    "action", 
    { 
      [action.id]: JSON.stringify(action) 
    }
  );

  return added;
}


// This is the entry point ot the actions system, that will also add the appropriate feed item or notification
//
// TODO: Handle 'near duplicates' better.
// i.e user toggles the like button a few times === steven liked token 2 (2 mins ago). steven liked token 2 (1 min ago)
export const addAction = async (action: HodlAction) => {
  console.log('action', action)

  action.timestamp = Date.now();

  // This should be in a transaction (multi/exec) but the rest api/upstash client doesn't support them
  // We are using the rest api as it handles concurrent connections better
  // https://docs.upstash.com/redis/features/restapi

  // It will not lead to data corruption, but there's always a chance we store an action, but don't add it to the user's activity, notifications or the feed 
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
      await addNotification(action.subject, action);

      return await addNotification(owner, action);

    } else if (action.object === "comment") {

      const likes = await likesComment(action.subject, action.objectId);
      if (!likes) {
        return;
      }

      const comment: HodlComment = await client.hget('comment', `${action.objectId}`);

      return await addNotification(comment.subject, action);
    }
  }

  // Who: 
  // if a reply, tell the comment author. 
  // if a token, tell the token owner.
  if (action.action === ActionTypes.CommentedOn) {
    const comment: HodlComment = await client.hget('comment', `${action.objectId}`);

    const owner = await getOwnerOrSellerAddress(comment.tokenId);

    return await addNotification(owner, action);
  }

  if (action.action === ActionTypes.Followed) { // tell the account someone followed it
    const follows = await isFollowing(action.subject, action.objectId);

    if (!follows) {
      return;
    }

    return await addNotification(`${action.objectId}`, action);
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

      const followers = await getFollowers(action.subject);

      let count = 0;
      for (let address of followers) {
        // count += await addNotification(`${address}`, action);
        count += await addToFeed(`${address}`, action);
      }

      return count;
    } catch (e) {
      return 0;
    }
  }

  if (action.action === ActionTypes.Added) { // tell the seller's followers there's a new token for sale
    try {
      const token: Nft = await fetchNFT(+action.objectId);

      if (token.owner !== action.subject) {
        return;
      }

      const followers = await getFollowers(action.subject);

      let count = 0;
      for (let address of followers) {
        // count += await addNotification(`${address}`, action);
        count += await addToFeed(`${address}`, action);
      }

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
