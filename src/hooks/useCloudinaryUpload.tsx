import { useState } from 'react';
import axios from 'axios'
import { assetTypeFromMimeType } from '../lib/utils';
import { AssetTypes } from '../models/AssetType';
import calculateAspectRatios from 'calculate-aspect-ratio';
import { resizeImage } from 'simple-image-resize';

export const useCloudinaryUpload = (): [Function, string, Function] => {
  const [error, setError] = useState('');

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
    const assetType = assetTypeFromMimeType(file.type);

    // Resize Image before upload to make it faster
    if (assetType === AssetTypes.Image) {
      const config = {
        quality: 0.92,
        maxWidth: 1080,
        maxHeight: 1350,
      };

      console.log('before', file.size)
      file = await resizeImage(file, config);
      console.log('after', file.size)

      if (file.size > 20 * 1024 * 1024) {
        setError(`Images can be up to 20MB`);
        return {
          success: false,
          fileName: null,
          mimeType: null,
          aspectRatio: null
        };
      }
    }

    let fd = new FormData();
    fd.append('upload_preset', getUploadPreset(assetType));
    fd.append('file', file);

    try {
      const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/upload`;
      const r = await axios.post(
        url,
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
        success: true,
        fileName: public_id,
        mimeType: `${resource_type}/${format}`,
        aspectRatio
      };
    } catch (error) {
      setError(error.response.data.error.message); // Just show the user cloudinary's error message

      return {
        success: false,
        fileName: null,
        mimeType: null,
        aspectRatio: null
      };
    }
  }

  return [uploadToCloudinary, error, setError];
}