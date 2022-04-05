import cloudinary from 'cloudinary'
import multer from 'multer';
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
      const isVideo = file.mimetype.indexOf('video') !== -1;
  
      return {
        folder: 'uploads',
        public_id: public_id,
        resource_type: isVideo ? 'video' : 'auto'
      };
    },
  });

  
const upload = multer({ storage }).single('asset');

export const uploadToCloudinary = (req, res) : Promise<any> => {
    return new Promise((resolve, reject) => {
        upload(req, res, error => {
        if (error) {
            reject(error);
        } else {
            resolve(true);
        }
        });
    });
}

export const removeFromCloudinary = (req, res): Promise<any> => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.destroy(req.body.fileUrl, (error, result) => { 
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
          })
    });
}