import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

const client = Redis.fromEnv()
import apiRoute from "../handler";
import { getProvider } from "../../../lib/server/connections";
import { ethers } from "ethers";
import { nftaddress } from "../../../config";
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { NotificationTypes, HodlNotification } from '../../../models/HodlNotifications';
import { getPriceHistory } from "../token-bought/[tokenId]";
import { likesToken } from "../like2/token/likes";
import { getTokensListed } from "../token-listed/[tokenId]";
import { getFollowers } from "../follow2/followers";
import { isFollowing } from "../follow2/follows";
import { likesComment } from "../like2/comment/likes";
import { getOwnerOrSellerAddress } from "../nft/[tokenId]";
import { HodlComment } from "../../../models/HodlComment";

dotenv.config({ path: '../.env' })
const route = apiRoute();

// we overwrite the timestamp, as we don't trust users
export const addNotification = async (notification: HodlNotification) => {
  console.log('notification', notification)
  notification.timestamp = Date.now();

  if (notification.action === NotificationTypes.Liked) { // tell the token owner you liked it
    if (notification.object === "token") {

      const likes = await likesToken(notification.subject, notification.objectId);
      if (!likes) {
        return;
      }

      const owner = await getOwnerOrSellerAddress(notification.objectId);

      return await client.zadd(
        `notifications:${owner}`,
        {
          score: notification.timestamp,
          member: JSON.stringify(notification)
        }
      );
    } else if (notification.object === "comment") {

      const likes = await likesComment(notification.subject, notification.objectId);
      if (!likes) {
        return;
      }

      const comment: HodlComment = await client.hget('comment', `${notification.objectId}`);

      return await client.zadd(
        `notifications:${comment.subject}`,
        {
          score: notification.timestamp,
          member: JSON.stringify(notification)
        }
      );
    }
  }

  if (notification.action === NotificationTypes.CommentedOn) {
    const comment: HodlComment = await client.hget('comment', `${notification.objectId}`);

    // if (notification.object === "token") {  
      const owner = await getOwnerOrSellerAddress(comment.tokenId);
      return await client.zadd(
        `notifications:${owner}`,
        {
          score: notification.timestamp,
          member: JSON.stringify(notification)
        }
      );
    // }
  }


  if (notification.action === NotificationTypes.Followed) { // tell the account someone followed it
    const follows = await isFollowing(notification.subject, notification.object);

    if (!follows) {
      return;
    }

    return await client.zadd(
      `notifications:${notification.object}`,
      {
        score: notification.timestamp,
        member: JSON.stringify(notification)
      }
    );
  }

  if (notification.action === NotificationTypes.Bought) { // tell the buyer and seller the sale happened
    const history = await getPriceHistory(notification.objectId);
    const buyer = history[0].buyerAddress;
    const seller = history[0].sellerAddress;

    if (buyer !== notification.subject) {
      return;
    }

    console.log('buyer', buyer)
    console.log('seller', seller)
    console.log('notification', JSON.stringify(notification))

    const first = await client.zadd(
      `notifications:${buyer}`,
      {
        score: notification.timestamp,
        member: JSON.stringify(notification)
      }
    );

    const second = await client.zadd(
      `notifications:${seller}`,
      {
        score: notification.timestamp,
        member: JSON.stringify(notification)
      }
    );

    return first + second;
  }

  if (notification.action === NotificationTypes.Listed) { // tell the seller's followers there's a new token for sale
    const history = await getTokensListed(notification.objectId);
    const seller = history[0].sellerAddress;

    if (seller !== notification.subject) {
      return;
    }

    const followers = await getFollowers(notification.subject);

    console.log('notification', notification)

    for (let address of followers) {
      await client.zadd(
        `notifications:${address}`,
        {
          score: notification.timestamp,
          member: JSON.stringify(notification)
        }
      );
    }

    return followers.length;
  }

  return 0;
}

// TODO: We might restrict this to certain actions client side
route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { action, token } = req.body;

  if (!action || !token) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  // block some actions in the API, as we don't need these to be directly called from the FE- 
  // i.e. adding a comment will already trigger the creation of a notification when that endpoint calls 'addNotification'
  if (action === NotificationTypes.CommentedOn) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const notification: HodlNotification = {
    subject: req.address,
    action,
    objectId: token
  };

  const success = await addNotification(notification);

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(200).json({ message: 'notification not added' });
  }
});


export default route;
