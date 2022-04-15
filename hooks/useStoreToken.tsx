import { hasExpired } from '../lib/utils';
import { useConnect } from './useConnect';

export const useStoreToken = () => {
  const [connect] = useConnect();

  const store = async (tokenId, mimeType, filter) => {
    if (hasExpired(localStorage.getItem('jwt'))) {
      await connect(true, true);
    }
    
    const r = await fetch('/api/mint/store', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('jwt')
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