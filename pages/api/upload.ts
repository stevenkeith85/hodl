import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect'
import multer from 'multer';
import cloudinary from 'cloudinary'

interface MulterRequest extends NextApiRequest {
  file: any;
}

import { CloudinaryStorage } from 'multer-storage-cloudinary';

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
    return {
      folder: 'uploads',
      format: 'jpeg',
      public_id: public_id,
    };
  },
});
 
const upload = multer({ storage });

const apiRoute = nextConnect({
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  },
});
apiRoute.use(upload.single('asset'));

apiRoute.post(async (req: MulterRequest, res: NextApiResponse) => {
  // TODO: Once we have authentication, consider storing users images under a separate folder
  if (req.body) { //Remove the old file as the user has changed their mind about which image to use
    cloudinary.v2.uploader.destroy(req.body.fileUrl, (error, result) => {
      res.status(200).json({ fileName: req.file.filename });
    })
  } else {
    res.status(200).json({ fileName: req.file.filename });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
