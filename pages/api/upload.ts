import { NextApiRequest, NextApiResponse } from "next";
import multer from 'multer';
import cloudinary from 'cloudinary'
import apiRoute from "./handler";

interface MulterRequest extends NextApiRequest {
  file: any;
}

import { CloudinaryStorage } from 'multer-storage-cloudinary';

const route = apiRoute();

// @ts-ignore
cloudinary.v2.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const public_id = file.fieldname + '-' + uniqueSuffix;
    const isVideo = file.mimetype.indexOf('video') !== -1;

    return {
      folder: 'uploads',
      public_id: public_id,
      resource_type: isVideo ? 'video' : 'auto'
    };
  },
});


const upload = multer({ storage }).single('asset');

const uploadToCloudinary = (req, res) : Promise<any> => {
  return new Promise((resolve, reject) => {
    upload(req, res, function (error) {
      if (error) {
        console.log('upload to cloudinary error', error)
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
}

  // TODO: Once we have authentication, consider storing users images under a separate folder
route.post(async (req: MulterRequest, res: NextApiResponse) => {

  try {
    await uploadToCloudinary(req, res);
  } catch (error) { 
    return res.status(error.http_code).json({ error });
  }
  
  if (req.body) { 
    cloudinary.v2.uploader.destroy(req.body.fileUrl, (error, result) => { //Remove the old file as the user has changed their mind about which image to use
      res.status(200).json({ fileName: req.file.filename,  mimeType: req?.file?.mimetype });
    })
  } else {
    res.status(200).json({ fileName: req?.file?.filename, mimeType: req?.file?.mimetype });
  }
});

export default route;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
