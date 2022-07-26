import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import { ipfsUriToGatewayUrl, sleep, TAG_PATTERN } from "../../../lib/utils";
import memoize from 'memoizee';
import apiRoute from "../handler";
import { getTokenUriAndOwner } from "../nft/[tokenId]";
import { getToken } from "../token/[tokenId]";
import axios from 'axios'
import { HodlAction, ActionTypes } from "../../../models/HodlAction";
import { addAction } from "../actions/add";
import { addTokenToTag } from "../tags/add";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

const getInfuraIPFSAuth = memoize(() => {
  const credentials = Buffer.from(process.env.INFURA_IPFS_PROJECT_ID + ':' + process.env.INFURA_IPFS_PROJECT_SECRET).toString('base64');
  var auth = { "Authorization" : `Basic ${credentials}` };
  return auth;
});

// TODO: Check for any XSS attacks here
// TODO: REDIS TRANSACTION
route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const {tokenId, mimeType, filter} = req.body;
  const {tokenUri, owner} = await getTokenUriAndOwner(tokenId);

  if (owner !== req.address) {
    return res.status(403).json({ message: "Only the token owner can add their token to HodlMyMoon" });
  }

  // https://community.infura.io/t/ipfs-api-rate-limit/4995
  const r = await axios.get(ipfsUriToGatewayUrl(tokenUri), { headers : getInfuraIPFSAuth() });

  const { name, description, privilege, image } = await r.data;

  const timestamp = Date.now();

  // store token, and add to sorted set with timestamp
  await client.set("token:" + tokenId, JSON.stringify({ tokenId, name, description, privilege, image, mimeType, filter }));

  await client.zadd(
    `tokens`,
    {
      score: timestamp,
      member: tokenId
    }
  );

  // extract tags  
  const tags = [...description.matchAll(TAG_PATTERN)].map(arr => arr[1])

  // Add tags. (NB: only the first 6 will be added)
  for (const tag of tags) {
    await addTokenToTag(tag, tokenId);
  }

  getToken.delete(tokenId);

  // TODO
  const notification: HodlAction = {
    subject: req.address,
    action: ActionTypes.Added,
    object: "token",
    objectId: tokenId
  };

  const success = addAction(notification);

  res.status(200).json({ tokenId, name, description, privilege, image });
});


export default route;
