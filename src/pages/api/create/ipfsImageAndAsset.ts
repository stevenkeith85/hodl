import { NextApiResponse } from "next";
import { create, urlSource } from 'ipfs-http-client'

import apiRoute from "../handler";
import { assetTypeFromMimeType } from "../../../lib/utils";
import { AssetTypes } from "../../../models/AssetType";

import cloudinary from 'cloudinary'
import { makeCloudinaryUrl } from "../../../lib/cloudinaryUrl";
import { ipfsImageAndAssetValidationSchema } from "../../../validation/uploadToIPFS";

// @ts-ignore
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

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

// TODO: I don't think we should still be using this???
const makeCloudinaryVideoUrl = (cid, extension = "mp4") => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  const environment = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER; // dev, staging, or prod
  const folder = 'uploads'

  let cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/video/upload`;

  return `${cloudinaryUrl}/${environment}/${folder}/${cid}.${extension}`
}

// https://community.infura.io/t/ipfs-api-rate-limit/4995
//
// image/asset are the same if we have an image (or gif) nft
// image/asset differ is we have a video nft
// we have no image if its an audio nft
//
// TODO: Possibly do the async stuff in parallel
const uploadImageAndAssetToIPFS = async (assetUrl, imageUrl) => {
  if (imageUrl && imageUrl !== assetUrl) { // image and asset are different

    const { content: assetContent } = urlSource(assetUrl);
    const assetPromise = ipfs.add(assetContent, { cidVersion: 1 });

    const { content: imgContent } = urlSource(imageUrl);
    const imagePromise = ipfs.add(imgContent, { cidVersion: 1 });

    const [asset, image] = await Promise.all([assetPromise, imagePromise]);

    return {
      assetCid: asset.cid.toString(),
      imageCid: image.cid.toString(),
    };
  } else { // image and asset are the same
    const { content: assetContent } = urlSource(assetUrl);
    const asset = await ipfs.add(assetContent, { cidVersion: 1 });

    return {
      assetCid: asset.cid.toString(),
      imageCid: asset.cid.toString(),
    };
  }
}

const updateCloudinary = async (
  fileName: string,
  assetType: AssetTypes,

  assetUrl: string,
  assetCid: string,

  imageUrl: string,
  imageCid: string
) => {

  const resourceType = (assetType === AssetTypes.Image || assetType === AssetTypes.Gif) ? 'image' : 'video';

  const uploadAssetPromise = cloudinary.v2.uploader.upload(assetUrl, {
    public_id: assetCid,
    folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER + '/nfts/',
    resource_type: resourceType
  });

  const uploadImagePromise = imageUrl !== assetUrl ? cloudinary.v2.uploader.upload(imageUrl, {
    public_id: imageCid,
    folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER + '/nfts/',
    resource_type: 'image'
  })
    : null;

  await Promise.all([uploadAssetPromise, uploadImagePromise]);

  // 3. Delete the asset (and its variants) from the upload folder.
  const deleted = await new Promise((resolve, reject) => {
    cloudinary.v2.uploader.destroy(
      fileName,
      { resource_type: resourceType },
      (error: any, result: any) => error ? reject(error) : resolve(result)
    );
  });
}

// We start uploading the image and asset data as soon as the user gets to the IPFS screen.
// This makes the upload process faster for the user :)

// TODO: If the user abandons the journey; we should unpin any IPFS assets
// TODO: We should also remove the image/asset from our servers
route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not authenticated" });
  }

  const isValid = await ipfsImageAndAssetValidationSchema.isValid(req.body)
  if (!isValid) {
    return res.status(400).json({ message: 'Invalid data supplied' });
  }

  const {
    fileName,
    filter,
    mimeType,
    aspectRatio
  } = req.body;

  const assetType = assetTypeFromMimeType(mimeType);

  // Asset
  let assetUrl = null;
  if (assetType === AssetTypes.Image) {
    assetUrl = makeCloudinaryUrl("image", "uploads", fileName.split('/')[2], { crop: 'fill', aspect_ratio: aspectRatio, effect: filter });
  } else if (assetType === AssetTypes.Gif) {
    assetUrl = makeCloudinaryUrl("image", "uploads", fileName.split('/')[2], { crop: 'fill', aspect_ratio: aspectRatio, effect: filter });
  } else if (assetType === AssetTypes.Audio) {
    assetUrl = makeCloudinaryUrl("video", "uploads", fileName.split('/')[2], {});
  } else if (assetType === AssetTypes.Video) {
    assetUrl = makeCloudinaryUrl("video", "uploads", fileName.split('/')[2], {}, 'mp4');
  }

  // Image
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

  // Upload Asset & Image to IPFS
  const { assetCid, imageCid } = await uploadImageAndAssetToIPFS(assetUrl, imageUrl);

  // TODO: This could potentially be done via a queue as the UI doesn't need it
  // Update Cloudinary
  await updateCloudinary(
    fileName,
    assetType,
    assetUrl,
    assetCid,
    imageUrl,
    imageCid
  );

  const result = {
    assetCid,
    imageCid
  };

  res.status(200).json(result);
});


export default route;
