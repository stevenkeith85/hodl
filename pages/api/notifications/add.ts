import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

const client = Redis.fromEnv()
import apiRoute from "../handler";
import { NotificationTypes, HodlNotification } from '../../../models/HodlNotifications';
import { getPriceHistory } from "../token-bought/[tokenId]";
import { likesToken } from "../like2/token/likes";
import { getTokensListed } from "../token-listed/[tokenId]";
import { getFollowers } from "../follow2/followers";
import { isFollowing } from "../follow2/follows";
import { likesComment } from "../like2/comment/likes";
import { fetchNFT, getOwnerOrSellerAddress } from "../nft/[tokenId]";
import { HodlComment } from "../../../models/HodlComment";
import { request } from "http";
import { Nft } from "../../../models/Nft";

dotenv.config({ path: '../.env' })
const route = apiRoute();

// Data Structures (TODO):
//
// The hash containing every notification made on HodlMyMoon
// "notification" -> {
//   1: "{ subject, object, objectId, timestamp }", 
//   2: "{ subject, object, objectId, timestamp }", 
// }
//
// The sorted set of notifications for the user:
// "notifications:0x1234" -> (<id>/<time>, <id>/<time>, <id>/<time>)

// we overwrite the timestamp, as we don't trust users
export const addNotification = async (notification: HodlNotification) => {
  console.log('notification', notification)
  notification.timestamp = Date.now();

  if (notification.action === NotificationTypes.Liked) { // tell the token owner you liked it
    if (notification.object === "token") {

      const likes = await likesToken(notification.subject, notification.id);
      if (!likes) {
        return;
      }

      const owner = await getOwnerOrSellerAddress(notification.id);

      return await client.zadd(
        `notifications:${owner}`,
        {
          score: notification.timestamp,
          member: JSON.stringify(notification)
        }
      );
    } else if (notification.object === "comment") {

      const likes = await likesComment(notification.subject, notification.id);
      if (!likes) {
        return;
      }

      const comment: HodlComment = await client.hget('comment', `${notification.id}`);

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
    const comment: HodlComment = await client.hget('comment', `${notification.id}`);

    const owner = await getOwnerOrSellerAddress(comment.tokenId);
    return await client.zadd(
      `notifications:${owner}`,
      {
        score: notification.timestamp,
        member: JSON.stringify(notification)
      }
    );
  }

  if (notification.action === NotificationTypes.Followed) { // tell the account someone followed it
    const follows = await isFollowing(notification.subject, notification.id);

    if (!follows) {
      return;
    }

    // THIS IS TEMP. MAKES IT EASIER TO DEBUG
    const selfNotified = await client.zadd(
      `notifications:${notification.subject}`,
      {
        score: notification.timestamp,
        member: JSON.stringify(notification)
      }
    );

    const followedNotified = await client.zadd(
      `notifications:${notification.id}`,
      {
        score: notification.timestamp,
        member: JSON.stringify(notification)
      }
    );

    return followedNotified;
  }

  // TODO: Probably need to bullet-proof the token notifications. just some ideas...
  // if a token is listed, we could get the listing and check the seller is the notification subject
  // possibly quicker than reading the blockchain events
  if (notification.action === NotificationTypes.Listed) { // tell the seller's followers there's a new token for sale
    try {
      const token: Nft = await fetchNFT(+notification.id);

      if (!token.forSale) {
        return;
      }

      if (token.owner !== notification.subject) {
        return;
      }

      const followers = await getFollowers(notification.subject);

      // THIS IS TEMP. MAKES IT EASIER TO DEBUG
      const selfNotified = await client.zadd(
        `notifications:${notification.subject}`,
        {
          score: notification.timestamp,
          member: JSON.stringify(notification)
        }
      );


      for (let address of followers) {
        await client.zadd(
          `notifications:${address}`,
          {
            score: notification.timestamp,
            member: JSON.stringify(notification)
          }
        );
      }

      return 1; // TODO: this SHOULD be the actual number of notifications added. Just set it to 1 for the moment to say 'success'
    } catch (e) {
      return 0;
    }
  }

  if (notification.action === NotificationTypes.Bought) { // tell the buyer and seller the sale happened
    const history = await getPriceHistory(notification.id);
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



  return 0;
}

// TODO: We might prevent this being called client side.
// We'd have to have a way of adding the listed, delisted, and bought notififications though.
route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { action, object, id } = req.body;

  if (!action || !object || !id) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  // block most actions in the API, as we don't need these to be directly called via the API. (reduces likelihood of bots posting misleading notifications / lies)
  if (action !== NotificationTypes.Delisted && // Perhaps we can query the blockchain via a scheduled task or something for these
    action !== NotificationTypes.Listed &&
    action !== NotificationTypes.Bought) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  if (object !== "token") {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const notification: HodlNotification = {
    subject: req.address, // user is telling us they did something. we'll check this against the blockchain before adding the notification
    action,
    id,
    object
  };

  const success = await addNotification(notification);

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(200).json({ message: 'notification not added' });
  }
});


export default route;
