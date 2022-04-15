import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import { ipfsUriToGatewayUrl } from "../../../lib/utils";
import memoize from 'memoizee';
import apiRoute from "../handler";
import { getTokenUriAndOwner } from "../../../lib/server/nft";

dotenv.config({ path: '../.env' })

const client = Redis.fromEnv()
const route = apiRoute();

const getInfuraIPFSAuth = memoize(() => {
  const credentials = Buffer.from(process.env.INFURA_IPFS_PROJECT_ID + ':' + process.env.INFURA_IPFS_PROJECT_SECRET).toString('base64');
  var auth = { "Authorization" : `Basic ${credentials}` };
  return auth;
});

route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const {tokenId, mimeType, filter} = req.body;
  const {tokenUri, owner} = await getTokenUriAndOwner(tokenId);

  if (owner !== req.address) {
    return res.status(403).json({ message: "Only the token owner can add their token to HodlMyMoon" });
  }

  const r = await fetch(ipfsUriToGatewayUrl(tokenUri), { headers : getInfuraIPFSAuth() }); // Potentially, we don't want to do it this way (as rate limiting / slow / etc)
  const { name, description, image } = await r.json()

  client.set("token:" + tokenId, JSON.stringify({ tokenId, name, description, image, mimeType, filter }));

  res.status(200).json({ tokenId, name, description, image });
});


export default route;
