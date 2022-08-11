import cloudinary from 'cloudinary'
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// @ts-ignore
cloudinary.v2.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const validator = (req, file, cb) => {    
    const fileType = file.mimetype.split('/')[0];
    const fileSize = parseInt(req.headers['content-length']);

    const acceptedFileTypes = ['image', 'video', 'audio'];
    if (acceptedFileTypes.indexOf(fileType) === -1) {
        cb(new Error('Unsupported file type'));
    }

    if (fileType == "image" && fileSize > 10 * 1024 * 1024 ) {
        cb(new Error('Images can be up to 10MB'));
    } else if (fileSize > 100 * 1024 * 1024) {
        cb(new Error('Videos or audio can be up to 100MB'));
    }
  
    cb(null, true);
  }

const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: async (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const public_id = file.fieldname + '-' + uniqueSuffix;
      const isVideo = file.mimetype.indexOf('video') !== -1;
  
      return {
        folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER + '/uploads',
        public_id: public_id,
        resource_type: isVideo ? 'video' : 'auto',
        // TODO: Test if we still want this
        eager: [ // doing too many of these seems to get us rate limited... even though cloudinary say there are no limits
            { fetch_format: "avif", format: "", quality: "auto"}
        ],                                   
        eager_async: true,
        timeout: 60000
      };
    },
  });
  
const upload = multer({ 
    storage,
    fileFilter: validator,
    limits: { 
        fields: 1,
        files: 1
    }
}).single('asset');

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

export const renameOnCloudinary = (from, to, isVideo) : Promise<any> => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.rename(
            from, 
            to, 
            { 
                overwrite: true, 
                resource_type: isVideo ? 'video' : 'image'
            }, 
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
        });
    })
}
