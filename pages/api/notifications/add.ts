import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

const client = Redis.fromEnv()
import apiRoute from "../handler";
import { getProvider } from "../../../lib/server/connections";
import { ethers } from "ethers";
import { nftaddress } from "../../../config";
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { AddressAction, HodlNotification, NftAction } from '../../../models/HodlNotifications';
import { getPriceHistory } from "../token-bought/[tokenId]";
import { likesToken } from "../like/likes";
import { getTokensListed } from "../token-listed/[tokenId]";
import { getFollowers } from "../follow2/followers";
import { isFollowing } from "../follow2/follows";
import { likesComment } from "../like2/comment/likes";

dotenv.config({ path: '../.env' })
const route = apiRoute();

// we overwrite the timestamp, as we don't trust users
export const addNotification = async (notification: HodlNotification) => {
  // if there's a timestamp and it's on a comment, then we keep it 
  // as we'd like the comment timestamp to match the notification timestamp. (to allow us to highlight it in the UI easily)
  // NB: We do not allow users to create CommentedOn notifications via the API directly

  // TODO: We've got id's for comments now, so this can be refactored/simplified
  // if (notification?.action !== NftAction.CommentedOn && notification?.action !== NftAction.Liked) {
    notification.timestamp = Date.now();
  // }

  if (notification.action === NftAction.Liked) { // tell the token owner you liked it

    if (notification.token) {
      const provider = await getProvider();
      const tokenContract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
      const owner = await tokenContract.ownerOf(notification.token);

      const likes = await likesToken(notification.subject, notification.token);

      if (!likes || owner === notification.subject) { // don't notify yourself that you liked your own NFT
        return;
      }

      return await client.zadd(
        `notifications:${owner}`,
        {
          score: notification.timestamp,
          member: JSON.stringify(notification)
        }
      );
    } else if (notification.comment) {
      const likes = await likesComment(notification.subject, notification.comment);

      const comment = await client.hget(`comment`, `${notification.comment}`);
      
      if (!likes || comment.subject === notification.subject) { // don't notify yourself that you liked your own NFT
        return;
      }

      return await client.zadd(
        `notifications:${comment.subject}`,
        {
          score: notification.timestamp,
          member: JSON.stringify(notification)
        }
      );
    }

  }

  if (notification.action === NftAction.CommentedOn) { // tell the token owner someone commented on their token
    const provider = await getProvider();
    const tokenContract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
    const owner = await tokenContract.ownerOf(notification.token);

    if (owner === notification.subject) {
      return; // We don't need to notify ourselves that we commented on something
    }

    return await client.zadd(
      `notifications:${owner}`,
      {
        score: notification.timestamp,
        member: JSON.stringify(notification)
      }
    );
  }


  if (notification.action === AddressAction.Followed) { // tell the account someone followed it
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

  if (notification.action === NftAction.Bought) { // tell the buyer and seller the sale happened
    const history = await getPriceHistory(notification.token);
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

  if (notification.action === NftAction.Listed) { // tell the seller's followers there's a new token for sale
    const history = await getTokensListed(notification.token);
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
  if (action === NftAction.CommentedOn) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const notification: HodlNotification = {
    subject: req.address,
    action,
    token
  };

  const success = await addNotification(notification);

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(200).json({ message: 'notification not added' });
  }
});


export default route;
