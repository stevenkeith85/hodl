// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs'
import nextConnect from 'next-connect'
import { create, urlSource } from 'ipfs-http-client'
import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })


const apiRoute = nextConnect({
  onNoMatch(req, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: 'Basic ' + Buffer.from(process.env.INFURA_IPFS_PROJECT_ID + ':' + process.env.INFURA_IPFS_PROJECT_SECRET).toString('base64'),
  },
});

// @ts-ignore
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadNFT = async (name, description, path) => {
  const url = `https://res.cloudinary.com/dyobirj7r/image/upload/${path}`
  // @ts-ignore
  const image = await ipfs.add(urlSource(url), { cidVersion: 1 });

  // upload metadata
  const data = JSON.stringify({ name, description, image: `ipfs://${image.cid}` });
  const metadata = await ipfs.add(data, { cidVersion: 1 });

  return {imageCid: image.cid, metadataCid: metadata.cid };
}

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, description, fileUrl } = req.body;

  const { imageCid, metadataCid } = await uploadNFT(name, description, fileUrl);
  console.log('here', imageCid, metadataCid)


  // overwrite is true for dev; will set to false in production
  cloudinary.v2.uploader.rename(fileUrl, 'nfts/' + imageCid.toString(), { overwrite: true }, (error, result) => {
    if (error) {
      console.log('ERROR', error, error.http_code)
      res.status(error.http_code).json(error);
    } else {
      const response = { imageCid, metadataUrl: `ipfs://${metadataCid}`};
      res.status(200).json(response);
    }
  });
});


export default apiRoute;
