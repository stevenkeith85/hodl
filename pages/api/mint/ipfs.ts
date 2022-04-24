import { NextApiResponse } from "next";
import { create, urlSource } from 'ipfs-http-client'
import cloudinary from 'cloudinary'
import apiRoute from "../handler";
import dotenv from 'dotenv'
import { createCloudinaryUrl, sleep, validFilter } from "../../../lib/utils";
import { renameOnCloudinary } from "../../../lib/server/cloudinary";

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

// We can do 10 adds per second. (slowing down the calls a little to mitigate the risk here)

// TODO - Consider using multiple IPFS upload/pinning services; or implement a queue feature so that we do do trigger rate limits at all
const uploadNFT = async (name, description, path, filter, isVideo) => {
  const url = !isVideo ?
    createCloudinaryUrl('image', 'upload', filter ? filter : null, 'uploads', path.split('/')[2]) :
    createCloudinaryUrl('video', 'upload', filter ? filter : null, 'uploads', path.split('/')[2])

  // @ts-ignore
  const image = await ipfs.add(urlSource(url), { cidVersion: 1 });
  sleep(2000);

  // upload metadata
  const data = JSON.stringify({ name, description, image: `ipfs://${image.cid}` });
  const metadata = await ipfs.add(data, { cidVersion: 1 });

  return { imageCid: image.cid, metadataCid: metadata.cid };
}

route.post(async (req, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not authenticated" });
  }

  const { name, description, fileUrl, mimeType, filter } = req.body;

  if (!name || !description || !fileUrl || !mimeType) {
    return res.status(400).json({ message: 'Bad request' });
  }

  if (name.length < 1 || name.length > 100) {
    return res.status(400).json({ message: 'Name must be between 1 and 100 characters' });
  }

  if (description.length < 1 || description.length > 1000) {
    return res.status(400).json({ message: 'Description must be between 1 and 1000 characters' });
  }

  if (filter && !validFilter(filter)) {
    return res.status(400).json({ message: 'Invalid filter' });
  }

  const isVideo = mimeType.indexOf('video') !== -1;

  const { imageCid, metadataCid } = await uploadNFT(name, description, fileUrl, filter, isVideo);

  await renameOnCloudinary(fileUrl, process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER + '/nfts/' + imageCid.toString(), isVideo);

  const response = {
    imageCid,
    metadataUrl: `ipfs://${metadataCid}`
  };

  res.status(200).json(response);
});


export default route;
