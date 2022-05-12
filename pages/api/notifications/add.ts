// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'

const client = Redis.fromEnv()
import apiRoute from "../handler";
import { getProvider } from "../../../lib/server/connections";
import { ethers } from "ethers";
import { nftaddress } from "../../../config";
import HodlNFT from '../../../artifacts/contracts/HodlNFT.sol/HodlNFT.json';
import { HodlNotification, NftAction } from './models';
import { getPriceHistory } from "../priceHistory/[tokenId]";
import { likesToken } from "../like/likes";
import { getTokensListed } from "../tokenListed/[tokenId]";
import { getFollowers } from "../follow/followers";

dotenv.config({ path: '../.env' })
const route = apiRoute();

// Integer reply, specifically:
// When used without optional arguments, the number of elements added to the sorted set (excluding score updates).
export const addNotification = async (notification: HodlNotification) => {
  if (notification.action === NftAction.Liked) { // tell the token owner you liked it
    const provider = await getProvider();
    const tokenContract = new ethers.Contract(nftaddress, HodlNFT.abi, provider);
    const owner = await tokenContract.ownerOf(notification.token);

    const likes = await likesToken(notification.subject, notification.token);

    if (!likes) {
      return; 
    }

    return await client.zadd(
      `notifications:${owner}`,
      {
        score: Date.now(),
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

    const first = await client.zadd(
      `notifications:${buyer}`,
      {
        score: Date.now(),
        member: JSON.stringify(notification)
      }
    );

    const second = await client.zadd(
      `notifications:${seller}`,
      {
        score: Date.now(),
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

    console.log('adding listed notification')
    const followers = await getFollowers(notification.subject);

    for (let address of followers) {
      await client.zadd(
        `notifications:${address}`,
        {
          score: Date.now(),
          member: JSON.stringify(notification)
        }
      );
    }
    
    return followers.length;
  }

  return 0;
}

// TODO: We might not want this to be callable from client side?
route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { action, token } = req.body;

  if (!action || !token) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const notification: HodlNotification = {
    subject: req.address,
    action,
    token
  };

  const success = addNotification(notification);

  if (success) {
    return res.status(200).json({ message: 'success' });
  } else {
    res.status(200).json({ message: 'notification not added' });
  }
});


export default route;
