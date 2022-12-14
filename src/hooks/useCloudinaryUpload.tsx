// import axios from 'axios'
import { assetTypeFromMimeType } from '../lib/utils';
import { AssetTypes } from '../models/AssetType';
import calculateAspectRatios from 'calculate-aspect-ratio';
import { resizeImage } from 'simple-image-resize';

export const useCloudinaryUpload = () => {
  const getUploadPreset = (assetType) => {
    if (assetType === AssetTypes.Image) {
      return `image_upload_${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}`
    } else if (assetType === AssetTypes.Video) {
      return `video_upload_${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}`
    } else if (assetType === AssetTypes.Gif) {
      return `gif_upload_${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}`
    } else if (assetType === AssetTypes.Audio) {
      return `audio_upload_${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}`
    }

    // not sure what it is; try the image upload preset. it will fail if its not an image
    return `image_upload_${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}`
  }

  const uploadToCloudinary = async (file) => {
    const { default: axios } = await import('axios');
    const assetType = assetTypeFromMimeType(file.type);

    // Resize Image before upload to make it faster
    if (assetType === AssetTypes.Image) {
      const config = {
        quality: 0.92,
        maxWidth: 1080,
        maxHeight: 1350,
      };

      file = await resizeImage(file, config); 
    }

    if (file.size > 20 * 1024 * 1024) {
      throw new Error(`Images can be up to 20MB`);
    }

    let fd = new FormData();
    fd.append('upload_preset', getUploadPreset(assetType));
    fd.append('file', file);

    const r = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/upload`,
      fd,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    const { public_id, resource_type, format, width, height } = r.data;

    const aspectRatio = calculateAspectRatios(width, height);

    return {
      fileName: public_id,
      mimeType: `${resource_type}/${format}`,
      aspectRatio
    };
  }

  return uploadToCloudinary;
}