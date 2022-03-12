// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import mime from 'mime'
import fs from 'fs'
import nextConnect from 'next-connect'
import { create } from 'ipfs-http-client'
import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })


const apiRoute = nextConnect({
  onNoMatch(req, res) {
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

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadNFT = async (name, description, path) => {
  const file = fs.readFileSync(path);
  const fileBuffer = new Buffer(file);

  const image = await ipfs.add(fileBuffer, { cidVersion: 1 });

  // upload metadata
  const data = JSON.stringify({ name, description, image: `ipfs://${image.cid}` });
  const metadata = await ipfs.add(data, { cidVersion: 1 });

  return {imageCid: image.cid, metadataCid: metadata.cid };
}

apiRoute.post(async (req, res) => {
  const { name, description, fileUrl } = req.body;

  const uploadsDir = 'public/uploads';
  const hashedDir = 'public/hashed';

  if (!fs.existsSync(hashedDir)) {
    fs.mkdirSync(hashedDir, { recursive: true });
  }

  const { imageCid, metadataCid } = await uploadNFT(name, description, `${uploadsDir}/${fileUrl}`);
  console.log('imageCid, metadataCid', imageCid, metadataCid);

  cloudinary.v2.uploader.upload(`${uploadsDir}/${fileUrl}`, { public_id: imageCid }, (error, result) => {
    console.log('error', error);
    console.log('result', result);
    if (error) {
      console.log(error);
      res.status(500).json({ error });  
    }

    fs.unlink(`${uploadsDir}/${fileUrl}`, () => null);
    
    const response = { imageCid, metadataUrl: `ipfs://${metadataCid}`};
    res.status(200).json(response);
  });
});


export default apiRoute;
