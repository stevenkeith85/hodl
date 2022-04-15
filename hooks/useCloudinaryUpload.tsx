import { useContext, useRef } from 'react';
import { hasExpired } from '../lib/utils';
import { WalletContext } from "../pages/_app";
import { useConnect } from './useConnect';

export const useCloudinaryUpload = () => {
  const previousFile = useRef(null);
  const [connect] = useConnect();

  const uploadToCloudinary = async (asset) => {
    const data = new FormData();
    data.append('asset', asset);

    if (previousFile.current) {
      data.append('fileUrl', previousFile.current);
    }

    if (hasExpired(localStorage.getItem('jwt'))) {
      await connect(true, true);
    }
    
    const r = await fetch('/api/mint/upload', {
      credentials: 'include',
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('jwt')
      }),
      body: data,
    });

    if (r.status === 200) {
      const { fileName, mimeType } = await r.json();
      previousFile.current = fileName;
      return {success: true, fileName, mimeType};
    } else if (r.status === 403) {
      await connect(false); 
    }

    return {success: false, fileName: null, mimeType: null};
  }

  return [uploadToCloudinary];
}