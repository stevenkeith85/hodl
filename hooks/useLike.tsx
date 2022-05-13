import { useState, useContext } from 'react';
import useSWR from 'swr';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios'

export const useLike = (tokenId) => {
  const { address } = useContext(WalletContext);
  const [error, setError] = useState('');

  const { data: tokenLikesCount, mutate: mutateLikesCount } = useSWR(tokenId ? [`/api/like/likeCount`, tokenId] : null,
    (url, tokenId) => axios.get(`${url}?token=${tokenId}`).then(r => r.data.count));

  const { data: userLikesThisToken, mutate: mutateUserLikesThisToken } = useSWR(address && tokenId ? [`/api/like/likes`, address, tokenId] : null,
    (url, address, tokenId) => axios.get(`${url}?address=${address}&token=${tokenId}`).then(r => Boolean(r.data.likes)));

  const toggleLike = async () => {
    if (!address) {
      return;
    }
    
    mutateLikesCount(old => userLikesThisToken ? old - 1 : old + 1, { revalidate: false });
    mutateUserLikesThisToken(old => !old, { revalidate: false })

    try {
      const r = await axios.post(
        '/api/like/like',
        { token: tokenId },
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