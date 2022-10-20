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
    const assetType = file.mimetype.split('/')[0];
    const assetFormat = file.mimetype.split('/')[1];

    const fileSize = parseInt(req.headers['content-length']);

    const acceptedAssets = ['image', 'video', 'audio'];

    if (acceptedAssets.indexOf(assetType) === -1) {
        cb(new Error('Unsupported media type'));
    }

    if (assetType == "image") {
        if (fileSize > 10 * 1024 * 1024) {
            cb(new Error('Images can be up to 10MB'));
        }
    } else if (assetType == "video") {
        if (fileSize > 100 * 1024 * 1024) {
            cb(new Error('Videos can be up to 100MB'));
        }

        if (assetFormat !== "mp4") {
            cb(new Error('Videos must be MP4'));
        }
    } else if (assetType == "audio") {
        if (fileSize > 100 * 1024 * 1024) {
            cb(new Error('Audio can be up to 100MB'));
        }

        if (assetFormat !== "wav" && assetFormat !== "mp3") {
            cb(new Error('Audio must be WAV or MP3'));
        }
    }

    cb(null, true);
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: async (req, file) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const public_id = `${file.fieldname}-${uniqueSuffix}`;

        const isImage = file.mimetype.indexOf('image') !== -1;
        const isVideo = file.mimetype.indexOf('video') !== -1;
        const isAudio = file.mimetype.indexOf('audio') !== -1;

        if (isImage) {
            console.log(file);
            console.log("Trying to upload an image to cloudinary")
            return {
                folder: `${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/uploads/`,
                public_id,
                resource_type: 'auto',
                timeout: 60000,
            };
        }
        else if (isVideo) {
            console.log("Trying to upload an image to cloudinary")
            return {
                folder: `${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/uploads/`,
                public_id,
                resource_type: 'video',
                timeout: 60000,
                eager: [
                    {
                        format: "jpg"
                    }
                ],
                transformation: {
                    duration: 60 // video clips can be up to a minute. (cloudinary transforms are v. expensive for videos)
                },
                format: 'mp4'
            };
        } else if (isAudio) {
            console.log("Trying to upload an image to cloudinary")
            return {
                folder: `${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/uploads/`,
                public_id,
                resource_type: 'video', // Note: Use the video resource type for all video assets as well as for audio files, such as .mp3. (from cloudinary)
                timeout: 60000,
                transformation: {
                    duration: 600 // audio clips can be up to 10 mins
                }
            };
        }
    },
});

const upload = multer({
    storage,
    fileFilter: validator,
    limits: {
        fields: 2,
        files: 1
    }
}).single('asset');


export const uploadToCloudinary = (req, res): Promise<any> => {
    return new Promise((resolve, reject) => {
        upload(
            req,
            res,
            error => {
                if (error) {
                    reject(error);
                } else {
                    resolve(req.file);
                }
            });
    });
}

export const removeFromCloudinary = (req, res): Promise<any> => {
    return new Promise((resolve, reject) => {
        const isImage = req?.body?.previousMimeType?.indexOf('image') !== -1;

        cloudinary.v2.uploader.destroy(
            req.body.previousFileName,
            { resource_type: isImage ? "image" : "video" },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
    });
}

export const removePublicIdFromCloudinary = (public_id: string, resource_type: "image" | "video"): Promise<any> => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.destroy(
            public_id,
            { resource_type },
            (error: any, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
    });
}

export const renameOnCloudinary = (from, to, isVideo): Promise<any> => {
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
