import { useContext } from 'react';
import { WalletContext } from "../pages/_app";
import { useConnect } from './useConnect';

export const useStoreToken = () => {
  const { jwt } = useContext(WalletContext);
  const [connect] = useConnect();

  const store = async (tokenId, mimeType, filter) => {
    const r = await fetch('/api/store', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': jwt
      }),
      body: JSON.stringify({ 
        tokenId, 
        mimeType,
        filter
      })
    });
    if (r.status === 403) {
      await connect(false);
    }
    else if (r.status === 200) {
      return true;
    } 

    return false;
  }

  return [store];
}