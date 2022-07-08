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

// Data Structures (TODO):
//
// The hash containing every notification made on HodlMyMoon
// "action" -> {
//   1: "{ id, subject, object, objectId, timestamp }", 
//   2: "{ id, subject, object, objectId, timestamp }", 
// }
//
// The sorted set of notifications for the user:
// "notifications:0x1234" -> (<action_id>/<timestamp>, <action_id>/<timestamp>, <action_id>/<timestamp>)


// Add <action> to <address>s notifications
const addNotification = async (address: string, action: HodlAction) : Promise<number> => {
  const added = await client.zadd(
    `notifications:${address}`,
    {
      score: action.timestamp,
      member: JSON.stringify(action)
    }
  );

  return added;
}

// TODO: Add <action> to <address>s feed
const addToFeed = async (address: string, action: HodlAction) : Promise<number> => {
  const added = await client.zadd(
    `feed:${address}`,
    {
      score: action.timestamp,
      member: JSON.stringify(action)
    }
  );

  return added;
}

// TODO: Add <action> to <address>s record.
// 
// We need this, for scenarios like:
// When A follows B, we'd like to add B's last action to A's feed (if it's not already there)
//
// We could also provide a general activity log at some point for the user/address.
const recordAction = async (address: string, action: HodlAction) : Promise<number> => {
  const added = await client.zadd(
    `actions:${address}`,
    {
      score: action.timestamp,
      member: JSON.stringify(action)
    }
  );

  return added;
}

// we overwrite the timestamp, as we don't trust users
export const addAction = async (action: HodlAction) => {
  console.log('action', action)

  action.timestamp = Date.now();

  if (action.action === ActionTypes.Liked) { // tell the token owner you liked it
    if (action.object === "token") {

      const likes = await likesToken(action.subject, action.id);
      if (!likes) {
        return;
      }

      const owner = await getOwnerOrSellerAddress(action.id);

      // THIS IS TEMP. MAKES IT EASIER TO DEBUG
      // const selfNotified = await client.zadd(
      //   `notifications:${notification.subject}`,
      //   {
      //     score: notification.timestamp,
      //     member: JSON.stringify(notification)
      //   }
      // );

      // return await client.zadd(
      //   `notifications:${owner}`,
      //   {
      //     score: action.timestamp,
      //     member: JSON.stringify(action)
      //   }
      // );

      return await addNotification(owner, action);

    } else if (action.object === "comment") {

      const likes = await likesComment(action.subject, action.id);
      if (!likes) {
        return;
      }

      const comment: HodlComment = await client.hget('comment', `${action.id}`);

      // THIS IS TEMP. MAKES IT EASIER TO DEBUG
      // const selfNotified = await client.zadd(
      //   `notifications:${notification.subject}`,
      //   {
      //     score: notification.timestamp,
      //     member: JSON.stringify(notification)
      //   }
      // );

      // return await client.zadd(
      //   `notifications:${comment.subject}`,
      //   {
      //     score: action.timestamp,
      //     member: JSON.stringify(action)
      //   }
      // );

      return await addNotification(comment.subject, action);
    }
  }

  // Who: 
  // if a reply, tell the comment author. 
  // if a token, tell the token owner.
  if (action.action === ActionTypes.CommentedOn) {
    const comment: HodlComment = await client.hget('comment', `${action.id}`);

    const owner = await getOwnerOrSellerAddress(comment.tokenId);

    // THIS IS TEMP. MAKES IT EASIER TO DEBUG
    // const selfNotified = await client.zadd(
    //   `notifications:${notification.subject}`,
    //   {
    //     score: notification.timestamp,
    //     member: JSON.stringify(notification)
    //   }
    // );

    // const ownerNotified = await client.zadd(
    //   `notifications:${owner}`,
    //   {
    //     score: action.timestamp,
    //     member: JSON.stringify(action)
    //   }
    // );

    // return ownerNotified;

    return await addNotification(owner, action);
  }

  if (action.action === ActionTypes.Followed) { // tell the account someone followed it
    const follows = await isFollowing(action.subject, action.id);

    if (!follows) {
      return;
    }

    // THIS IS TEMP. MAKES IT EASIER TO DEBUG
    // const selfNotified = await client.zadd(
    //   `notifications:${notification.subject}`,
    //   {
    //     score: notification.timestamp,
    //     member: JSON.stringify(notification)
    //   }
    // );

    // const followedNotified = await client.zadd(
    //   `notifications:${action.id}`,
    //   {
    //     score: action.timestamp,
    //     member: JSON.stringify(action)
    //   }
    // );

    // return followedNotified;

    return await addNotification(`${action.id}`, action);
  }

  // Who: Tell the seller's followers there's a new token for sale
  if (action.action === ActionTypes.Listed) {
    try {
      const token: Nft = await fetchNFT(+action.id);

      if (!token.forSale) {
        return;
      }

      if (token.owner !== action.subject) {
        return;
      }

      const followers = await getFollowers(action.subject);

      // THIS IS TEMP. MAKES IT EASIER TO DEBUG
      // const selfNotified = await client.zadd(
      //   `notifications:${action.subject}`,
      //   {
      //     score: action.timestamp,
      //     member: JSON.stringify(action)
      //   }
      // );

      let count = 0;
      for (let address of followers) {
        // await client.zadd(
        //   `notifications:${address}`,
        //   {
        //     score: action.timestamp,
        //     member: JSON.stringify(action)
        //   }
        // );
        count += await addNotification(`${address}`, action);
      }

      return count;
    } catch (e) {
      return 0;
    }
  }

  if (action.action === ActionTypes.Added) { // tell the seller's followers there's a new token for sale
    try {
      const token: Nft = await fetchNFT(+action.id);

      if (token.owner !== action.subject) {
        return;
      }

      const followers = await getFollowers(action.subject);

      // THIS IS TEMP. MAKES IT EASIER TO DEBUG
      // const selfNotified = await client.zadd(
      //   `notifications:${notification.subject}`,
      //   {
      //     score: notification.timestamp,
      //     member: JSON.stringify(notification)
      //   }
      // );

      let count = 0;
      for (let address of followers) {
        // await client.zadd(
        //   `notifications:${address}`,
        //   {
        //     score: action.timestamp,
        //     member: JSON.stringify(action)
        //   }
        // );
        count += await addNotification(`${address}`, action);
      }

      return count;
    } catch (e) {
      return 0;
    }
  }

  // Who: Tell the buyer and seller the sale happened
  if (action.action === ActionTypes.Bought) {

    const history = await getPriceHistory(action.id);

    if (history.length === 0) {
      return 0;
    }

    const buyer = history[0].buyerAddress;
    const seller = history[0].sellerAddress;

    if (buyer !== action.subject) {
      return;
    }

    // const first = await client.zadd(
    //   `notifications:${buyer}`,
    //   {
    //     score: action.timestamp,
    //     member: JSON.stringify(action)
    //   }
    // );

    const first = await addNotification(`${buyer}`, action);
    const second = await addNotification(`${seller}`, action);

    // const second = await client.zadd(
    //   `notifications:${seller}`,
    //   {
    //     score: action.timestamp,
    //     member: JSON.stringify(action)
    //   }
    // );

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
    id,
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
