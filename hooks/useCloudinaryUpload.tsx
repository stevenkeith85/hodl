import { useContext, useRef } from 'react';
import { WalletContext } from "../pages/_app";
import { useConnect } from './useConnect';

export const useCloudinaryUpload = () => {
  const { jwt } = useContext(WalletContext);
  const previousFile = useRef(null);
  const [connect] = useConnect();

  const uploadToCloudinary = async (asset) => {
    const data = new FormData();
    data.append('asset', asset);

    // If the user uploads a new file; remove the previous one
    if (previousFile.current) {
      data.append('fileUrl', previousFile.current);
    }
    
    const r = await fetch('/api/upload', {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json',
        'Authorization': jwt
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