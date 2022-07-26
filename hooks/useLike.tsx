import { useState, useContext } from 'react';
import useSWR from 'swr';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios'

export const useLike = (id, token = true, prefetchedLikeCount = null) => {
  const { address } = useContext(WalletContext);
  const [error, setError] = useState('');

  const baseUrl = token ? `/api/like/token/` : `/api/like/comment/`;

  const { data: tokenLikesCount, mutate: mutateLikesCount } = useSWR(
    id ? [baseUrl + `count`, id] : null,
    (url, id) => axios.get(`${url}?id=${id}`).then(r => r.data.count),
    {
      fallbackData: prefetchedLikeCount
    }
  );

  const { data: userLikesThisToken, mutate: mutateUserLikesThisToken } = useSWR(
    address && id ? [baseUrl + 'likes', address, id] : null,
    (url, address, id) => axios.get(`${url}?address=${address}&id=${id}`).then(r => Boolean(r.data.likes))
  );

  const toggleLike = async () => {
    if (!address) {
      return;
    }

    mutateLikesCount(old => userLikesThisToken ? old - 1 : old + 1, { revalidate: false });
    mutateUserLikesThisToken(old => !old, { revalidate: false })

    try {
      const r = await axios.post(
        baseUrl + 'like',
        { id },
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('jwt')
          },
        }
      )
    } catch (error) {
      mutateLikesCount();
      mutateUserLikesThisToken();

      return { success: false, fileName: null, mimeType: null };
    }
  }

  return [tokenLikesCount, userLikesThisToken, toggleLike, error, setError];
}