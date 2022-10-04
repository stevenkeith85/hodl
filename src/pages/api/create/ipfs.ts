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
const makeCloudinaryImageUrl = (cid, filter = null, aspectRatio = null) => {
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
const makeCloudinaryVideoUrl = (cid, extension = "mp4") => {
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

  const assetType = assetTypeFromMimeType(mimeType);

  console.log('api/create/ipfs - asset url -', assetUrl);

  // upload asset
  const { content: assetContent } = urlSource(assetUrl);
  const asset = await ipfs.add(assetContent, { cidVersion: 1 });

  let image = asset;

  // if we have an image; and it is different to the asset
  // add it to IPFS
  //
  // image/asset are the same if we have an image (or gif) nft
  // image/asset differ is we have a video nft
  // we have no image if its an audio nft
  if (imageUrl && imageUrl !== assetUrl) {
    const { content: imgContent } = urlSource(imageUrl);
    image = await ipfs.add(imgContent, { cidVersion: 1 });
  }

  let hodlMetadata: HodlMetadata = {
    name,
    description,
    image: assetType === AssetTypes.Audio ? null : `ipfs://${image.cid}`, // audio nfts currently have no image
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

// Video transformations can only happen via the API (and not the browser) as they are super expensive.
// We currently create a still frame for the video at the upload to cloudinary stage via an eager transform
// and do any manipulations we need on that instead.

// TODO: In future we may let the user select/upload a still frame for the video; and possibly a cover image for their audio nfts
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

  let assetUrl = null;
  if (assetType === AssetTypes.Image) {
    assetUrl = makeCloudinaryImageUrl(fileName.split('/')[2], filter, aspectRatio);
  } else if (assetType === AssetTypes.Gif) {
    assetUrl = makeCloudinaryImageUrl(fileName.split('/')[2]);
  } else if (assetType === AssetTypes.Audio) {
    assetUrl = makeCloudinaryVideoUrl(fileName.split('/')[2], mimeType.split('/')[1]);
  } else if (assetType === AssetTypes.Video) {
    assetUrl = makeCloudinaryVideoUrl(fileName.split('/')[2]);
  }

  let imageUrl = null;
  if (assetType === AssetTypes.Image) {
    imageUrl = assetUrl;
  } else if (assetType === AssetTypes.Gif) {
    imageUrl = assetUrl;
  } else if (assetType === AssetTypes.Audio) {
    imageUrl = assetUrl;
  } else if (assetType === AssetTypes.Video) {
    imageUrl = makeCloudinaryVideoUrl(fileName.split('/')[2], 'jpg');
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
    resource_type: (assetType === AssetTypes.Image || assetType === AssetTypes.Gif) ? 'auto' : 'video'
  });
  console.log('create/ipfs - cloudinary upload response 1', JSON.stringify(response1))

  if (imageUrl !== assetUrl) {
    // Upload image to cloudinary nfts folder
    const response2: UploadApiResponse = await cloudinary.v2.uploader.upload(imageUrl, {
      public_id: imageCid,
      folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER + '/nfts/',
      resource_type: 'image'
    });
    console.log('create/ipfs - cloudinary upload response 2', JSON.stringify(response2))
  }

  // Delete the asset (and its variants) from the upload folder.
  const deleted = await removePublicIdFromCloudinary(fileName,
    (assetType === AssetTypes.Image || assetType === AssetTypes.Gif) ? 'image' : 'video'
  );
  console.log('create/ipfs - cloudinary deleted response', JSON.stringify(deleted))

  const result = {
    imageCid: assetCid, // TODO: Rename client side, and update this
    metadataUrl: `ipfs://${metadataCid}`
  };

  res.status(200).json(result);
});


export default route;
