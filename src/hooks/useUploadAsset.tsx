import axios from 'axios' // TODO: Dynamic import
import { ipfsImageAndAssetValidationSchema } from "../validation/uploadToIPFS";

// This will just throw any errors back to the caller to handle
export const useUploadAsset = () => {
  const upload = async (
    fileName: string,
    filter: string,
    mimeType: string,
    aspectRatio: string
  ) => {

      const isValid = await ipfsImageAndAssetValidationSchema.isValid({fileName, filter, mimeType, aspectRatio})

      if (!isValid) {
        throw new Error("Asset cannot be uploaded")
      }

      const r = await axios.post(
        '/api/create/ipfsImageAndAsset',
        {
          fileName,
          filter,
          mimeType,
          aspectRatio
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )

      const { imageCid, assetCid } = r.data;
      
      return {
        imageCid,
        assetCid
      };
  }

  return upload;
}