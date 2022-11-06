import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';

import { User, UserViewModel } from "../../../models/User";
import { Token } from "../../../models/Token";


import apiRoute from '../handler';
import { getAsString } from "../../../lib/getAsString";

const client = Redis.fromEnv()
const route = apiRoute();


export const getUser = async (
  handle: string,
  viewerAddress: string,
  nonce = false): Promise<UserViewModel | null> => {

  if (!handle) {
    return null;
  }

  let address = handle;

  if (!/^0x[0-9A-F]{40}$/i.test(address)) {// An ethereum/polygon address is a 42 character hexadecimal address
    address = await client.get(`nickname:${handle}`);
  }

  if (!address) {
    return null;
  }

  // TODO - We should check the 'users' collection first; as the user may have a uuid entry; 
  // but they've not actually signed the message to connect to the site
  let user = null;
  if (nonce) {
    user = await client.hmget<User>(`user:${address}`, 'address', 'nickname', 'avatar', 'nonce', 'blockNumber');
  } else {
    user = await client.hmget<User>(`user:${address}`, 'address', 'nickname', 'avatar');
  }

  if (!user) {
    return null;
  }

  const vm: UserViewModel = {
    address: user.address,
    nickname: user.nickname,
    avatar: null,
    followedByViewer: false,
    followsViewer: false
  }

  if (nonce) {
    vm.nonce = user.nonce;
    vm.blockNumber = user.blockNumber;
  }

  const avatarPromise = user?.avatar ? client.get<Token>(`token:${user.avatar}`) : null;

  let viewerAddressPromise = null;

  // if we have a known user viewing this; get their details
  if (viewerAddress) {
    const pipeline = client.pipeline();

    pipeline.zscore(`user:${viewerAddress}:following`, user?.address);
    pipeline.zscore(`user:${user?.address}:following`, viewerAddress);

    viewerAddressPromise = pipeline.exec<[number, number]>();
  }

  const [avatar, result] = await Promise.all([avatarPromise, viewerAddressPromise]);

  vm.avatar = avatar;

  if (result) {
    vm.followedByViewer = Boolean(result[0]);
    vm.followsViewer = Boolean(result[1]);
  }

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
