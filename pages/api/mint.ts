// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import mime from 'mime'
import fs from 'fs'
import { rename } from 'fs/promises';
import nextConnect from 'next-connect'
import { create } from 'ipfs-http-client'

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

// TODO - Extract this so that we can use for the script upload
apiRoute.post(async (req, res) => {
  const { name, description, fileUrl } = req.body;
  console.log(name, description, fileUrl);

  const path = 'public/uploads/' + fileUrl;

  // upload image
  // TODO:
  // We store it with just the contentId
  // if we store it with a path, i.e. contentId/image[.jpg|.png]
  // then we could read the file extension client side, and negate the extra client-side call to IPFS (to determine mimetype)
  const file = fs.readFileSync(path);
  const fileBuffer = new Buffer(file);
  const image = await ipfs.add(fileBuffer, { cidVersion: 1 });
  console.log('image', image);

  // upload metadata
  const data = JSON.stringify({ name, description, image: `ipfs://${image.cid}` });
  const metadata = await ipfs.add(data, { cidVersion: 1 });
  console.log('metadata', metadata);

  const token = { ipnft: metadata.cid, url: `ipfs://${metadata.cid}` };
  console.log(token);

  var dir = 'public/hashed';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const mimetype = mime.getType(path);
  const ext = mime.getExtension(mimetype);
  rename(path, 'public/hashed/' + image.cid + '.' + ext);

  res.status(200).json({ token });
});


export default apiRoute;
