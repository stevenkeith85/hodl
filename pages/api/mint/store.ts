import { NextApiResponse } from "next";
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import { ipfsUriToGatewayUrl, sleep } from "../../../lib/utils";
import memoize from 'memoizee';
import apiRoute from "../handler";
import { getTokenUriAndOwner } from "../nft/[tokenId]";
import { getToken } from "../token/[tokenId]";
import axios from 'axios'

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

  // https://community.infura.io/t/ipfs-api-rate-limit/4995
  const r = await axios.get(ipfsUriToGatewayUrl(tokenUri), { headers : getInfuraIPFSAuth() });

  const { name, description, privilege, image } = await r.data;

  await client.set("token:" + tokenId, JSON.stringify({ tokenId, name, description, privilege, image, mimeType, filter }));

  getToken.delete(tokenId);

  res.status(200).json({ tokenId, name, description, privilege, image });
});


export default route;
