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
import { Token } from "../../../models/Token";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

const getInfuraIPFSAuth = memoize(() => {
  const credentials = Buffer.from(process.env.INFURA_IPFS_PROJECT_ID + ':' + process.env.INFURA_IPFS_PROJECT_SECRET).toString('base64');
  var auth = { "Authorization": `Basic ${credentials}` };
  return auth;
});

// TODO: Check for any XSS attacks here
// TODO: REDIS TRANSACTION
route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  // If the user were to POST a different filter to what the image on IPFS used; it 'could' be a little misleading.
  // i.e. we use the filter to do the transformation on the fly. Perhaps we should transform the source image instead.
  const { tokenId: id, mimeType, filter } = req.body;

  const { tokenUri: metadata, owner } = await getTokenUriAndOwner(id);

  if (owner !== req.address) {
    return res.status(403).json({ message: "Only the token owner can add their token to HodlMyMoon" });
  }

  // We consult IPFS to ensure the data we store matches what is there.
  // The alternative would be to let the user POST this data; but the problem is they could (in theory) just POST any values and we'd store
  // different data to what's on IPFS
  //
  // We may revisit this...

  // https://community.infura.io/t/ipfs-api-rate-limit/4995
  const r = await axios.get(
    ipfsUriToGatewayUrl(metadata),
    {
      headers: getInfuraIPFSAuth()
    });
  const { name, description, privilege, image } = await r.data;


  const token: Token = {
    id,
    name,
    description,
    image,
    metadata,
    mimeType,
    filter,
    privilege,
    creator: req.address
  };

  const timestamp = Date.now();

  // store token, and add to sorted set with timestamp
  await client.set(`token:${id}`, token);

  await client.zadd(
    `tokens`,
    {
      score: timestamp,
      member: id
    }
  );

  // extract tags  
  const tags = [...description.matchAll(TAG_PATTERN)].map(arr => arr[1])

  // Add tags. (NB: only the first 6 will be added)
  for (const tag of tags) {
    await addTokenToTag(tag, id);
  }

  // getToken.delete(id);

  // TODO
  const notification: HodlAction = {
    subject: req.address,
    action: ActionTypes.Added,
    object: "token",
    objectId: id
  };

  const success = addAction(notification);

  res.status(200).json({ tokenId: id, name, description, privilege, image });
});


export default route;
