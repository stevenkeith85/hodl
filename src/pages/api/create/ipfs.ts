import { NextApiResponse } from "next";
import { create, urlSource } from 'ipfs-http-client'
import cloudinary, { UploadApiResponse } from 'cloudinary'
import apiRoute from "../handler";
import dotenv from 'dotenv'
import { createCloudinaryUrl } from "../../../lib/utils";
import { uploadToIPFSValidationSchema } from "../../../validation/uploadToIPFS";
import { HodlMetadata } from "../../../models/Metadata";
import { removeFromCloudinary, removePublicIdFromCloudinary } from "../../../lib/server/cloudinary";

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

  return `${cloudinaryUrl}/${environment}/${folder}/${cid}.jpg`
}

// https://community.infura.io/t/ipfs-api-rate-limit/4995
// TODO: Separate image and asset to allow cover art for music etc
const uploadNFT = async (
  name,
  description,
  fileName,
  license,
  filter,
  mimeType,
  aspectRatio
) => {
  const isImage = mimeType.indexOf('image') !== -1;

  const assetUrl: string = isImage ?
    makeCloudinaryImageUrl(fileName.split('/')[2], filter, aspectRatio) :
    createCloudinaryUrl('video', 'upload', filter, 'uploads', fileName.split('/')[2]);

  const { path, content } = urlSource(assetUrl);
  const asset = await ipfs.add(content, { cidVersion: 1 });

  const hodlMetadata: HodlMetadata = {
    name,
    description,
    image: `ipfs://${asset.cid}`,
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
    imageCid: asset.cid.toString(),
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

  const { imageCid, metadataCid } = await uploadNFT(
    name,
    description,
    fileName,
    license,
    filter,
    mimeType,
    aspectRatio
  );

  // Upload the IPFS image to cloudinary so that the filter/ crop becomes permanent
  const processedImg = makeCloudinaryImageUrl(fileName.split('/')[2], filter, aspectRatio);
  console.log('create/ipfs - processedImg - ', processedImg)

  const response : UploadApiResponse = await cloudinary.v2.uploader.upload(processedImg, {
    public_id: imageCid,
    folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER + '/nfts/'
  });

  console.log('create/ipfs - cloudinary upload response', JSON.stringify(response))

  // delete the upload folder item
  // await cloudinary.v2.uploader.destroy(fileName);

  const deleted = await removePublicIdFromCloudinary(fileName)

  console.log('create/ipfs - cloudinary deleted response', JSON.stringify(deleted))

  const result = {
    imageCid,
    metadataUrl: `ipfs://${metadataCid}`
  };

  res.status(200).json(result);
});


export default route;
