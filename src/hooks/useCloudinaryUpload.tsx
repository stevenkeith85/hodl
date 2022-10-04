import { useRef, useState } from 'react';
import axios from 'axios'

export const useCloudinaryUpload = (): [Function, string, Function] => {
  const previousFileName = useRef(null);
  const previousMimeType = useRef(null);

  const [error, setError] = useState('');


  const uploadToCloudinary = async (asset) => {
    const data = new FormData();
    data.append('asset', asset);

    // User has changed their mind; delete the old file
    // TODO: If the user navigates away from the page; we also need a method of cleaning up cloudinary :(
    // Potentilly we could just do a sweep with the management api and remove any files older than a day or so
    if (previousFileName.current && previousMimeType.current) {
      data.append('previousFileName', previousFileName.current);
      data.append('previousMimeType', previousMimeType.current);
    }

    try {
      const r = await axios.post(
        '/api/create/upload',
        data,
        {
          headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
          },
        }
      )
      const { fileName, mimeType } = r.data;

      previousFileName.current = fileName;
      previousMimeType.current = mimeType;

      return { success: true, fileName, mimeType };
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 429) {
        const { message } = error.response.data;
        setError(message);
      }

      return { success: false, fileName: null, mimeType: null };
    }
  }

  return [uploadToCloudinary, error, setError];
}