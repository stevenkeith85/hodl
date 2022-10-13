import { NextApiRequest, NextApiResponse } from "next";

import dotenv from 'dotenv'
import memoize from 'memoizee';
import apiRoute from '../handler';
//
// This is used for getting a 'minimal' NFT. i.e. only what we've stored in Redis (NOT the data from the blockchain).
// We use this for operations that don't need blockchain data
//

import { Redis } from '@upstash/redis';
import { isValid } from "date-fns";
import { isValidAddress } from "../../../lib/profile";
import { User, UserViewModel } from "../../../models/User";
import { Token } from "../../../models/Token";
import { getAsString, ipfsUriToCid } from "../../../lib/utils";
import { isOwnerOrSeller } from "../nft/[tokenId]";
import { isFollowing } from "../follows";
import { ethers } from "ethers";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();


const getAvatar = async (user: User): Promise<Token> => {
  if (!user?.avatar) {
    return null;
  }

  return client.get<Token>(`token:${user.avatar}`);
}

export const getUser = async (
  handle: string,
  viewerAddress: string,
  nonce = false): Promise<UserViewModel | null> => {

  if (!handle) {
    return null;
  }

  let address = handle;

  if (!ethers.utils.isAddress(address)) {
    address = await client.get(`nickname:${handle}`);
  }

  if (!address) {
    return null;
  }

  // TODO - We should check the 'users' collection first; as the user may have a uuid entry; but they've not actually signed the message to connect to the site
  let user = null;
  if (nonce) {
    user = await client.hmget<User>(`user:${address}`, 'address', 'nickname', 'avatar', 'nonce', 'blockNumber');
  } else {
    user = await client.hmget<User>(`user:${address}`, 'address', 'nickname', 'avatar');
  }

  const vm: UserViewModel = {
    address: user.address,
    nickname: user.nickname,
    avatar: null,
    followedByViewer: false,
    followsViewer: false,
  }

  if (nonce) {
    vm.nonce = user.nonce;
    vm.blockNumber = user.blockNumber;
  }

  const avatarPromise = getAvatar(user);
  
  const followedByViewerPromise = isFollowing(viewerAddress, user?.address);
  const followsViewerPromise = isFollowing(user?.address, viewerAddress);
  
  const [avatar, followedByViewer, followsViewer] = await Promise.all([avatarPromise, followedByViewerPromise, followsViewerPromise]);

  vm.avatar = avatar;
  vm.followedByViewer = Boolean(followedByViewer);
  vm.followsViewer = Boolean(followsViewer);

  return vm;
}


route.get(async (req, res: NextApiResponse) => {
  const handle = getAsString(req.query.handle);

  if (!handle) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const user = await getUser(handle, req?.address);
  res.status(200).json({ user })
});

export default route;
