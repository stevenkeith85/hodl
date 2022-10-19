import axios from 'axios'
import { HodlMetadata } from '../models/Metadata';


export const useIpfsUpload = (): [Function] => {
  const uploadToIpfs = async (
    fileName: string,
    {
      name,
      description,
      image,
      properties: {
        asset: {
          license,
          mimeType,
          uri
        },
        filter,
        aspectRatio
      }
    }: HodlMetadata
  ) => {

    try {
      const r = await axios.post(
        '/api/create/ipfs',
        {
          name,
          description,
          license,
          fileName,
          mimeType,
          filter,
          aspectRatio
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )

      const { imageCid, metadataUrl } = r.data;
      return { success: true, imageCid, metadataUrl };
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 429) {
        const { message } = error.response.data;
        console.log(message);

        return { success: false, imageCid: null, metadataUrl: null };
      }
    }
  }
  return [uploadToIpfs];
}