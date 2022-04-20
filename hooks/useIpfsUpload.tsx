import { useState } from 'react';
import { hasExpired } from '../lib/utils';
import { useConnect } from './useConnect';

export const useIpfsUpload = () => {
  const [connect] = useConnect();

  const uploadToIpfs = async (name, description, fileName, mimeType, filter) => {
    if (hasExpired(localStorage.getItem('jwt'))) {
      await connect(true, true);
    }
    
    const r = await fetch('/api/mint/ipfs', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('jwt')
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
      return {success: false, imageCid: null, metadataUrl: null};
    } else if (r.status === 200) {
      const {imageCid, metadataUrl} = await r.json();
      return {success: true, imageCid, metadataUrl};
    } else {
      const { message } = await r.json();
      return {success: false, imageCid: null, metadataUrl: null, message};
    }
  }

  return [uploadToIpfs];
}
