import { NextApiResponse } from "next";
import { create, urlSource } from 'ipfs-http-client'
import cloudinary, { UploadApiResponse } from 'cloudinary'
import apiRoute from "../handler";
import dotenv from 'dotenv'
import { assetTypeFromMimeType } from "../../../lib/utils";
import { uploadToIPFSValidationSchema } from "../../../validation/uploadToIPFS";
import { HodlMetadata } from "../../../models/Metadata";
import { removePublicIdFromCloudinary } from "../../../lib/server/cloudinary";
import { AssetTypes } from "../../../models/AssetType";

dotenv.config({ path: '../.env' })

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

// @ts-ignore
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// This is what will go to IPFS. 
// We only want to do filtering or cropping here. i.e. we want the full sized asset limited to 1080
const makeCloudinaryImageUrl = (cid, filter, aspectRatio) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  const environment = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER; // dev, staging, or prod
  const folder = 'uploads';

  let cloudinaryUrl = ``;

  if (aspectRatio) {
    cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,ar_${aspectRatio},w_1080`;
  } else {
    cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_1080`;
  }

  if (filter) {
    cloudinaryUrl = `${cloudinaryUrl},${filter}`;
  }

  return `${cloudinaryUrl}/${environment}/${folder}/${cid}`
}

// We do not do any transformations on video, as they are really expensive :(
const makeCloudinaryVideoUrl = (cid, extension="mp4") => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  const environment = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER; // dev, staging, or prod
  const folder = 'uploads'

  let cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/video/upload`;

  return `${cloudinaryUrl}/${environment}/${folder}/${cid}.${extension}`
}

// https://community.infura.io/t/ipfs-api-rate-limit/4995
// TODO: Separate image and asset to allow cover art for music, still frame for the video, etc
const uploadContentToIPFS = async (
  name,
  description,
  license,
  filter,
  mimeType,
  aspectRatio,
  assetUrl,
  imageUrl
) => {

  console.log('api/create/ipfs - asset url -', assetUrl);

  // upload asset
  const { content: assetContent } = urlSource(assetUrl);
  const asset = await ipfs.add(assetContent, { cidVersion: 1 });

  // upload img
  const { content: imgContent } = urlSource(imageUrl);
  const image = await ipfs.add(imgContent, { cidVersion: 1 });

  let hodlMetadata: HodlMetadata = {
    name,
    description,
    image: `ipfs://${image.cid}`,
    properties: {
      aspectRatio,
      filter,
      asset: {
        uri: `ipfs://${asset.cid}`,
        license,
        mimeType
      }
    }
  };

  const metadata = await ipfs.add(JSON.stringify(hodlMetadata), { cidVersion: 1 });

  return {
    assetCid: asset.cid.toString(),
    imageCid: image.cid.toString(),
    metadataCid: metadata.cid.toString()
  };
}

// TODO: Check for any XSS attacks here
route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not authenticated" });
  }

  const isValid = await uploadToIPFSValidationSchema.isValid(req.body)
  if (!isValid) {
    return res.status(400).json({ message: 'Invalid data supplied' });
  }

  const {
    name,
    description,
    fileName,
    license,
    filter,
    mimeType,
    aspectRatio
  } = req.body;

  const assetType = assetTypeFromMimeType(mimeType);

  // TODO: Audio and Gifs
  // TODO: Optimise so that we aren't doing any unnecessary double uploads, etc
  let assetUrl = '';
  if (assetType === AssetTypes.Image) {
    assetUrl = makeCloudinaryImageUrl(fileName.split('/')[2], filter, aspectRatio);
  } else if (assetType === AssetTypes.Video) {
    assetUrl = makeCloudinaryVideoUrl(fileName.split('/')[2]);
  }

  let imageUrl = '';
  if (assetType === AssetTypes.Image) {
    imageUrl = assetUrl;
  } else if (assetType === AssetTypes.Video) {
    imageUrl = makeCloudinaryVideoUrl(fileName.split('/')[2], 'jpg'); // We did an eager transformation during the select asset stage. video transforms are locked down, as they are very expensive
  }

  const { assetCid, imageCid, metadataCid } = await uploadContentToIPFS(
    name,
    description,
    license,
    filter,
    mimeType,
    aspectRatio,
    assetUrl,
    imageUrl
  );

  // Upload asset to cloudinary nfts folder
  const response1: UploadApiResponse = await cloudinary.v2.uploader.upload(assetUrl, {
    public_id: assetCid,
    folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER + '/nfts/',
    resource_type: assetType === AssetTypes.Image ? 'auto' : 'video'
  });

  // Upload image to cloudinary nfts folder
  const response2: UploadApiResponse = await cloudinary.v2.uploader.upload(imageUrl, {
    public_id: imageCid,
    folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER + '/nfts/',
    resource_type: 'auto'
  });

  console.log('create/ipfs - cloudinary upload response 1', JSON.stringify(response1))
  console.log('create/ipfs - cloudinary upload response 2', JSON.stringify(response2))

  // Delete the upload folder item
  const deleted = await removePublicIdFromCloudinary(fileName)
  console.log('create/ipfs - cloudinary deleted response', JSON.stringify(deleted))

  const result = {
    imageCid: assetCid, // TODO: Rename client side, and update this
    metadataUrl: `ipfs://${metadataCid}`
  };

  res.status(200).json(result);
});


export default route;
