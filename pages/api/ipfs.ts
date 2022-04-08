// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { create, urlSource } from 'ipfs-http-client'
import cloudinary from 'cloudinary'
import apiRoute from "./handler";
import dotenv from 'dotenv'
import { createCloudinaryUrl } from "../../lib/utils";
import { renameOnCloudinary } from "../../lib/server/cloudinary";
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


const uploadNFT = async (name, description, path, mimeType, filter, isVideo) => {
  const url = !isVideo ? 
    createCloudinaryUrl('image', 'upload', filter ? filter : null, 'uploads', path.split('/')[2]) : 
    createCloudinaryUrl('video', 'upload', filter ? filter : null, 'uploads', path.split('/')[2])
  
  // @ts-ignore
  const image = await ipfs.add(urlSource(url), { cidVersion: 1 });

  // upload metadata
  const data = JSON.stringify({ name, description, image: `ipfs://${image.cid}` });
  const metadata = await ipfs.add(data, { cidVersion: 1 });

  return {imageCid: image.cid, metadataCid: metadata.cid };
}

route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  const { name, description, fileUrl, mimeType, filter } = req.body;

  const isVideo = mimeType.indexOf('video') !== -1;

  const { imageCid, metadataCid } = await uploadNFT(name, description, fileUrl, mimeType, filter, isVideo);

  
  await renameOnCloudinary(fileUrl, process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER + '/nfts/' + imageCid.toString(), isVideo);
  
  const response = { 
    imageCid, 
    metadataUrl: `ipfs://${metadataCid}`
  };

  res.status(200).json(response);
});


export default route;
