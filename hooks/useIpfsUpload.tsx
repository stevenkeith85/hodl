import { useContext } from 'react';
import { WalletContext } from "../pages/_app";
import { useConnect } from './useConnect';

export const useIpfsUpload = () => {
  const { jwt } = useContext(WalletContext);
  const [connect] = useConnect();

  const uploadToIpfs = async (name, description, fileName, mimeType, filter) => {
    const r = await fetch('/api/ipfs', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': jwt
      }),
      body: JSON.stringify({ 
        name, 
        description, 
        fileUrl: fileName, 
        mimeType,
        filter
      })
    });

    if (r.status === 403) {
      await connect(false);      
    } else if (r.status === 200) {
      const {imageCid, metadataUrl} = await r.json();
    
      return {success: true, imageCid, metadataUrl};
    }

    return {success: false, imageCid: null, metadataUrl: null };
  }

  return [uploadToIpfs];
}