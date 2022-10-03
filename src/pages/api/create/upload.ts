import { NextApiResponse } from "next";
import { removeFromCloudinary, uploadToCloudinary } from "../../../lib/server/cloudinary";
import apiRoute, { HodlApiRequest } from "../handler";

interface MulterRequest extends HodlApiRequest {
  file: any;
}

const route = apiRoute();


route.post(async (req: MulterRequest, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  try {
    const response = await uploadToCloudinary(req, res);
    console.log('api/create/upload - uploaded asset to cloudinary - ', response)
  } catch (e) {
    console.log('api/create/upload - error uploading asset to cloudinary - ', e)
    return res.status(400).json({message: e.message})
  }
  
  if (req?.body?.previousFileName) {
    console.log('api/create/upload - uploaded a second asset to cloudinary, removing the first - ', req?.body?.fileUrl);
    const result = await removeFromCloudinary(req, res);
    console.log('api/create/upload - removed first asset from cloudinary - ', result);
  } 
  
  return res.status(200).json({ 
    fileName: req?.file?.filename, 
    mimeType: req?.file?.mimetype 
  });
});

export default route;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
