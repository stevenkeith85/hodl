import cloudinary from 'cloudinary'

// @ts-ignore
cloudinary.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});


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
