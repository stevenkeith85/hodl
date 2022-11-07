import { NextApiResponse } from "next";
import { create } from 'ipfs-http-client'

import apiRoute from "../handler";

import { assetTypeFromMimeType } from "../../../lib/utils";
import { HodlMetadata } from "../../../models/Metadata";

import { AssetTypes } from "../../../models/AssetType";
import { ipfsMetadataValidationSchema } from "../../../validation/uploadToIPFS";


const route = apiRoute();

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: 'Basic ' +
      Buffer.from(process.env.INFURA_IPFS_PROJECT_ID +
        ':' +
        process.env.INFURA_IPFS_PROJECT_SECRET).toString('base64'),
  },
});


// https://community.infura.io/t/ipfs-api-rate-limit/4995
const uploadMetadataToIPFS = async (
  name,
  description,
  license,
  filter,
  mimeType,
  aspectRatio,
  assetCid,
  imageCid
) => {

  const assetType = assetTypeFromMimeType(mimeType);

  let hodlMetadata: HodlMetadata = {
    name,
    description,
    image: assetType === AssetTypes.Audio ? null : `ipfs://${imageCid}`, // audio nfts currently have no image
    properties: {
      aspectRatio,
      filter,
      asset: {
        uri: `ipfs://${assetCid}`,
        license,
        mimeType
      }
    }
  };

  const metadata = await ipfs.add(JSON.stringify(hodlMetadata), { cidVersion: 1 });
  console.log('IPFS add metadata result', metadata);

  return {
    metadataCid: metadata.cid.toString()
  };
}

// Video transformations can only happen via the API (and not the browser) as they are super expensive.
// We currently create a still frame for the video at the upload to cloudinary stage via an eager transform
// and do any manipulations we need on that instead.

// TODO: In future we may let the user select/upload a still frame for the video; and possibly a cover image for their audio nfts
// TODO: Check for any XSS attacks here
route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not authenticated" });
  }

  const isValid = await ipfsMetadataValidationSchema.isValid(req.body)
  if (!isValid) {
    return res.status(400).json({ message: 'Invalid data supplied' });
  }

  const {
    name,
    description,
    license,
    filter,
    mimeType,
    aspectRatio,
    assetCid,
    imageCid
  } = req.body;


  const { metadataCid } = await uploadMetadataToIPFS(
    name,
    description,
    license,
    filter,
    mimeType,
    aspectRatio,
    assetCid,
    imageCid
  );

  const result = {
    metadataUrl: `ipfs://${metadataCid}`
  };

  res.status(200).json(result);
});


export default route;
