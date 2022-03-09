import nextConnect from 'next-connect'
import mime from 'mime'
import multer from 'multer';

// Returns a Multer instance that provides several methods for generating 
// middleware that process files uploaded in multipart/form-data format.
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    limits: {
      fileSize: 104857600, // 100MB
    },
    filename: (req, file, cb) => { // https://expressjs.com/en/resources/middleware/multer.html
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      console.log('file', file);
      const ext = mime.getExtension(file.mimetype);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext); // asset-timestamp-random
    }
  }),
});

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res.status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  },
});

const uploadMiddleware = upload.single('asset');

apiRoute.use(uploadMiddleware);

apiRoute.post(async (req, res) => {
  res.status(200)
    .json({ fileName: req.file.filename });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
