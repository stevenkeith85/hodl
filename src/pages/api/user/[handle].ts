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

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();


const getAvatar = async (user: User) : Promise<Token>=> {
  if (!user?.avatar) {
    return null;
  }

  const ownsToken = await isOwnerOrSeller(user.address, user.avatar);

  // We clear it here to save the future isOwnerOrSeller checks. (reduces blockchain calls)
  if (!ownsToken) {
    await client.hmset(`user:${user.address}`, {'avatar': ''});
  }

  return client.get<Token>(`token:${user.avatar}`);
}

export const getUser = async (handle: string, viewerAddress: string): Promise<UserViewModel | null> => {

  if (!handle) {
    return null;
  }

  let address = handle;

  const validAddress = await isValidAddress(handle);

  if (!validAddress) {
    address = await client.get(`nickname:${handle}`);
  }

  // TODO - We should check the 'users' collection first; as the user may have a nonce entry; but they've not actually signed the message to connect to the site
  const user = await client.hmget<User>(`user:${address}`, 'address', 'nickname', 'avatar');

  // if we haven't seen this user before, then just return basic info.
  // this shouldn't actually happen in the wild; but is useful for dev
  if (!user) {
    return {
      address: handle,
      nickname: null,
      avatar: null,
      followedByViewer: false,
      followsViewer: false
    }
  }

  const vm: UserViewModel = {
    address: user.address,
    nickname: user.nickname,
    avatar: null,
    followedByViewer: false,
    followsViewer: false
  }

  const avatarPromise = getAvatar(user);
  const followedByViewerPromise = isFollowing(viewerAddress, user?.address);
  const followsViewerPromise = isFollowing(user?.address, viewerAddress);

  const [avatar, followedByViewer, followsViewer] = await Promise.all([avatarPromise, followedByViewerPromise, followsViewerPromise]);

  vm.avatar = avatar;
  // vm.avatar.image = ipfsUriToCid(vm.avatar?.image); // TODO - Just store the cid
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
