import { useState } from 'react';
import axios from 'axios'
import { assetTypeFromMimeType } from '../lib/utils';
import { AssetTypes } from '../models/AssetType';
import calculateAspectRatios from 'calculate-aspect-ratio';


export const useCloudinaryUpload = (): [Function, string, Function] => {
  const [error, setError] = useState('');

  const getUploadPreset = (file) => {
    const assetType = assetTypeFromMimeType(file.type);
    
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
    console.log('file object', file);

    let fd = new FormData();
    fd.append('upload_preset', getUploadPreset(file));
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

      console.log('cloudinary response', r.data);
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