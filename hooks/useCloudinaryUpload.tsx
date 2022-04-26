import { useRef, useState } from 'react';
import { hasExpired } from '../lib/utils';
import { useConnect } from './useConnect';
import axios from 'axios'

export const useCloudinaryUpload = () => {
  const previousFile = useRef(null);
  const [connect] = useConnect();

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

    let r;
    try {
      r = await axios.post(
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
    } catch (e) {
      return { success: false, fileName: null, mimeType: null };  
    }
    
    if (r.status === 200) {
      const { fileName, mimeType } = r.data;
      previousFile.current = fileName;
      return { success: true, fileName, mimeType };
    } else if (r.status === 403) {
      await connect(false);
    }

    return { success: false, fileName: null, mimeType: null };
  }

  return [uploadToCloudinary, progress];
}