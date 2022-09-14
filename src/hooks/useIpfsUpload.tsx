import axios from 'axios'
import { useState } from 'react';
import { HodlMetadata } from '../models/Metadata';


export const useIpfsUpload = (): [
  (string, HodlMetadata) => any,
  number,
  string,
  Function
] => {
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

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
    setProgress(0);

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
          onUploadProgress: progress => {
            if (!progress.lenthComputable) {
              setProgress(null);
            }
            setProgress(Math.floor(progress.loaded / progress.total * 100))
          }
        }
      )

      const { imageCid, metadataUrl } = r.data;
      return { success: true, imageCid, metadataUrl };
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 429) {
        const { message } = error.response.data;
        setError(message);
      } else {
        setError('Something has gone wrong')
      }

      return { success: false, imageCid: null, metadataUrl: null };
    }
  }

  return [uploadToIpfs, progress, error, setError];
}
