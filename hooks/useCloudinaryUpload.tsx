import { useRef, useState } from 'react';
import { hasExpired } from '../lib/utils';
import { useConnect } from './useConnect';
import axios from 'axios'

export const useCloudinaryUpload = () => {
  const previousFile = useRef(null);
  const [connect] = useConnect();

  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const uploadToCloudinary = async (asset) => {
    setProgress(0);
    const data = new FormData();
    data.append('asset', asset);

    if (previousFile.current) {
      data.append('fileUrl', previousFile.current);
    }

    if (hasExpired(localStorage.getItem('jwt'))) {
      await connect(true, true);
    }

    try {
      const r = await axios.post(
        '/api/mint/upload',
        data,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('jwt')
          },
          onUploadProgress: progress => {
            if (!progress.lenthComputable) {
              setProgress(null);
            }
            setProgress(Math.floor(progress.loaded / progress.total * 100))
          }
        }
      )
      const { fileName, mimeType } = r.data;
      previousFile.current = fileName;

      return { success: true, fileName, mimeType };
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 429) {
        const { message } = error.response.data;
        setError(message);
      } else if (error.response.status === 403) {
        await connect(false);
      } 

      return { success: false, fileName: null, mimeType: null };
    }
  }

  return [uploadToCloudinary, progress, error, setError];
}