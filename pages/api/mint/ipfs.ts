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

// https://community.infura.io/t/ipfs-api-rate-limit/4995
const uploadNFT = async (name, description, privilege, path, filter, isVideo) => {
  const url = !isVideo ?
    createCloudinaryUrl('image', 'upload', filter, 'uploads', path.split('/')[2]) :
    createCloudinaryUrl('video', 'upload', filter, 'uploads', path.split('/')[2])

  // @ts-ignore
  const image = await ipfs.add(urlSource(url), { cidVersion: 1 });

  const data = JSON.stringify({ name, description, privilege, image: `ipfs://${image.cid}` });
  const metadata = await ipfs.add(data, { cidVersion: 1 });

  return { imageCid: image.cid.toString(), metadataCid: metadata.cid.toString() };
}

route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not authenticated" });
  }

  const isValid = await uploadToIPFSValidationSchema.isValid(req.body)
  if (!isValid) {
    return res.status(400).json({ message: 'Invalid data supplied' });
  }

  const { name, description, privilege, fileName, mimeType, filter } = req.body;
  const isVideo = mimeType.indexOf('video') !== -1;

  const { imageCid, metadataCid } = await uploadNFT(
    name, 
    description,
    privilege, 
    fileName, 
    filter, 
    isVideo
  );

  await renameOnCloudinary(
    fileName, 
    process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER + '/nfts/' + imageCid, 
    isVideo
  );

  const response = {
    imageCid,
    metadataUrl: `ipfs://${metadataCid}`
  };

  res.status(200).json(response);
});


export default route;
