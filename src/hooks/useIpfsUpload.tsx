import axios from 'axios'

export const useIpfsUpload = (): [Function, Function] => {
  const uploadImageAndAsset = async (
    fileName: string,
    filter: string,
    mimeType: string,
    aspectRatio: string
  ) => {

    try {
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
        success: true,
        imageCid,
        assetCid
      };
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 429) {
        // TODO: Report this somewhere (probably ui)
        // const { message } = error.response.data;
        
        return {
          success: false,
          imageCid: null,
          assetCid: null
        };
      }
    }
  }

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

    try {
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
      return { 
        success: true, 
        metadataUrl 
      };
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 429) {
        // TODO
        // const { message } = error.response.data;

        return { 
          success: false, 
          metadataUrl: null 
        };
      }
    }
  }

  return [uploadImageAndAsset, uploadMetadata];
}