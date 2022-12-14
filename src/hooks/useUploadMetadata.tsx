import axios from 'axios'
import { ipfsMetadataValidationSchema } from "../validation/uploadToIPFS";


export const useUploadMetadata = () => {
  const uploadMetadata = async (
    name: string,
    description: string,
    license: string,
    filter: string,
    mimeType: string,
    aspectRatio: string,
    assetCid: string,
    imageCid: string
  ) => {

    const isValid = await ipfsMetadataValidationSchema.isValid({
      name,
      description,
      license,
      filter,
      mimeType,
      aspectRatio,
      assetCid,
      imageCid
    })

    if (!isValid) {
      throw new Error("Error with the supplied data. Metadata cannot be uploaded")
    }

    const r = await axios.post(
      '/api/create/ipfsMetadata',
      {
        name,
        description,
        license,
        filter,
        mimeType,
        aspectRatio,
        assetCid,
        imageCid,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )

    const { metadataUrl } = r.data;

    return metadataUrl;
  }

  return uploadMetadata;
}