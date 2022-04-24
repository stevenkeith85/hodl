import { useContext, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { hasExpired, trim } from '../lib/utils';
import { WalletContext } from "../pages/_app";
import { useConnect } from './useConnect';

export const useNickname = () => {
  const { address } = useContext(WalletContext);
  const [connect] = useConnect();
  const [apiError, setApiError] = useState(null);

  const { data: nickname } = useSWR(address ? [`/api/profile/nickname`, address] : null,
        (url, query) => fetch(`${url}?address=${query}`)
            .then(r => r.json())
            .then(json => json.nickname), 
            {
              dedupingInterval: 60000 * 30, // don't check this more than once every 30 mins as nicknames rarely change, and we already invalidate the cache if they do
            })
  
  
  const update = async (nickname) => {
    if (hasExpired(localStorage.getItem('jwt'))) {
      await connect(true, true);
    }
      const r = await fetch('/api/profile/nickname', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': localStorage.getItem('jwt')
        }),
        body: JSON.stringify({
          nickname: trim(nickname).toLowerCase()
        })
      });

      if (r.status === 200) {
        mutate([`/api/profile/nickname`, address])
        return true;
      } else if (r.status === 403) {
        await connect(false);
        return false;
      } else {
        const { message } = await r.json();
        setApiError(message);
        return false;
      }
  }

  return [update, apiError, setApiError, nickname];
}
