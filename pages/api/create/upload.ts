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
    await uploadToCloudinary(req, res);
  } catch (e) {
    return res.status(400).json({message: e.message})
  }
  
  if (req?.body?.fileUrl) {
    await removeFromCloudinary(req, res);
  } 
  
  res.status(200).json({ 
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
