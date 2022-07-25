import { useContext, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios'

export const useNickname = () => {
  const { address } = useContext(WalletContext);
  const [apiError, setApiError] = useState(null);

  const { data: nickname } = useSWR(address ? [`/api/profile/nickname`, address] : null,
    (url, query) => axios.get(`${url}?address=${query}`).then(r => r.data.nickname),
    {
      dedupingInterval: 5000,
      focusThrottleInterval: 5000, // default is 5000
      errorRetryCount: 1,
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    })


  const update = async (nickname) => {
    try {
      const r = await axios.post(
        '/api/profile/nickname',
        { nickname },
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('jwt')
          },
        }
      );

      mutate([`/api/profile/nickname`, address])
      return true;

    } catch (error) {
      const { message } = await error.response.data;
      setApiError(message);
      return false;
    }
  }

  return [update, apiError, setApiError, nickname];
}
