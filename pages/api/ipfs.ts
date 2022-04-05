// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { create, urlSource } from 'ipfs-http-client'
import cloudinary from 'cloudinary'
import apiRoute from "./handler";
import dotenv from 'dotenv'
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
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadNFT = async (name, description, path, mimeType) => {
  console.log(name, description, path, mimeType)
  const url = mimeType.indexOf('video') === -1 ? `https://res.cloudinary.com/dyobirj7r/image/upload/${path}`: `https://res.cloudinary.com/dyobirj7r/video/upload/${path}`
  
  // @ts-ignore
  const image = await ipfs.add(urlSource(url), { cidVersion: 1 });

  // upload metadata
  const data = JSON.stringify({ name, description, image: `ipfs://${image.cid}` });
  const metadata = await ipfs.add(data, { cidVersion: 1 });

  return {imageCid: image.cid, metadataCid: metadata.cid };
}

route.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, description, fileUrl, mimeType } = req.body;

  console.log('here')
  const { imageCid, metadataCid } = await uploadNFT(name, description, fileUrl, mimeType);
  console.log('we go')
  // overwrite is true for dev; will set to false in production
  // TODO: If this falls over, we've already minted a token. We should try to recover
  cloudinary.v2.uploader.rename(fileUrl, 'nfts/' + imageCid.toString(), { overwrite: true, resource_type: mimeType.indexOf('video') !== -1 ? 'video' : 'image' }, (error, result) => {
    if (error) {
      console.log('cloudinary rename error', error)
      res.status(error.http_code).json(error);
    } else {
      console.log('cloudinary rename success', result)
      const mimeType = `${result.resource_type}/${result.format}`;
      const response = { imageCid, metadataUrl: `ipfs://${metadataCid}`, mimeType};
      res.status(200).json(response);
    }
  });
});


export default route;
