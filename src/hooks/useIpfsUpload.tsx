import axios from 'axios'
import { useState } from 'react';


export const useIpfsUpload = (): [
  (name: string, description: string, privilege: string, fileName: string, mimeType: string, filter: string, aspectRatio?: "1:1" | "4:5" |"16:9") => any,
  number,
  string,
  Function
] => {
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const uploadToIpfs = async (
      name: string, 
      description: string, 
      privilege: string, 
      fileName: string, 
      mimeType: string, 
      filter: string, 
      aspectRatio?: "1:1" | "4:5" |"16:9") => {
    setProgress(0);

    try {
      const r = await axios.post(
        '/api/create/ipfs',
        {
          name,
          description,
          privilege,
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
