import { NextApiResponse } from "next";
import { create, urlSource } from 'ipfs-http-client'
import cloudinary from 'cloudinary'
import apiRoute from "../handler";
import dotenv from 'dotenv'
import { createCloudinaryUrl } from "../../../lib/utils";
import { renameOnCloudinary } from "../../../lib/server/cloudinary";
import { uploadToIPFSValidationSchema } from "../../../validationSchema/uploadToIPFS";

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

// https://community.infura.io/t/ipfs-api-rate-limit/4995
const uploadNFT = async (name, description, privilege, path, filter, isVideo, aspectRatio) => {
  const url = !isVideo ?
    makeCloudinaryImageUrl(path.split('/')[2], filter, aspectRatio) :
    createCloudinaryUrl('video', 'upload', filter, 'uploads', path.split('/')[2])

  // @ts-ignore
  const image = await ipfs.add(urlSource(url), { cidVersion: 1 });
  const data = JSON.stringify({ name, description, privilege, image: `ipfs://${image.cid}` });
  const metadata = await ipfs.add(data, { cidVersion: 1 });

  return { imageCid: image.cid.toString(), metadataCid: metadata.cid.toString() };
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

  const { name, description, privilege, fileName, mimeType, filter, aspectRatio } = req.body;
  const isVideo = mimeType.indexOf('video') !== -1;
  const isAudio = mimeType && mimeType.indexOf('audio') !== -1;

  const { imageCid, metadataCid } = await uploadNFT(
    name,
    description,
    privilege,
    fileName,
    filter,
    isVideo || isAudio,
    aspectRatio
  );

  // await renameOnCloudinary(
  //   fileName,
  //   process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER + '/nfts/' + imageCid,
  //   isVideo || isAudio
  // );



  // Upload the IPFS image to cloudinary so that the filter/ crop becomes permanent
  await cloudinary.v2.uploader.upload(
    makeCloudinaryImageUrl(fileName.split('/')[2], filter, aspectRatio),
    {
      public_id: imageCid,
      folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER + '/nfts/'
    });

  // delete the upload folder item
  await cloudinary.v2.uploader.destroy(fileName);

  const response = {
    imageCid,
    metadataUrl: `ipfs://${metadataCid}`
  };

  res.status(200).json(response);
});


export default route;
