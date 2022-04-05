import { useState, useContext } from 'react';
import { WalletContext } from "../pages/_app";
import { useConnect } from './useConnect';

export const useUpload = () => {
  const { jwt } = useContext(WalletContext);
  const [mimeType, setMimeType] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [connect] = useConnect();

  const upload = async (asset) => {
    const data = new FormData();
    data.append('asset', asset);
    data.append('fileUrl', fileName);

    const r = await fetch('/api/upload', {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json',
        'Authorization': jwt
      }),
      body: data,
    });

    if (r.status === 403) {
      await connect(false);
      return false;
    } else if (r.status === 200) {
      const { fileName, mimeType } = await r.json();
      setMimeType(mimeType); 
      setFileName(fileName); 
      return true;
    } 
  }

  return [upload, fileName, mimeType];
}