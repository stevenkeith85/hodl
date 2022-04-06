import { NextApiResponse } from "next";
import { removeFromCloudinary, uploadToCloudinary } from "../../lib/server/cloudinary";
import apiRoute, { HodlApiRequest } from "./handler";

interface MulterRequest extends HodlApiRequest {
  file: any;
}

const route = apiRoute();

route.post(async (req: MulterRequest, res: NextApiResponse) => {
  if (!req.address) {
    return res.status(403).json({ message: "Not Authenticated" });
  }

  await uploadToCloudinary(req, res);

  if (req?.body?.fileUrl) {
    console.log(req.body)
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
