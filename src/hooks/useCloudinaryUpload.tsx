import { useRef, useState } from 'react';
import axios from 'axios'

export const useCloudinaryUpload = (): [Function, string, Function] => {
  const [error, setError] = useState('');

  const uploadToCloudinary = async (file) => {
    let fd = new FormData();
    fd.append('upload_preset', 'browser_upload');
    fd.append('file', file);
    fd.append('folder', `${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/uploads/`);
    
    // We can use this to remove the uploaded file if the user pickes something different or navigates away
    // We need to do signed uploads first though
    //fd.append('return_delete_token', '1');

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

      const { public_id, resource_type, format } = r.data;

      return { success: true, fileName: public_id, mimeType: `${resource_type}/${format}` };
    } catch (error) {
      alert(error.response.data.error.message);
      return { success: false, fileName: null, mimeType: null };
    }
  }

  return [uploadToCloudinary, error, setError];
}