import { useState, useContext } from 'react';
import useSWR, { mutate } from 'swr';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios'

export const useLike = (
  id: number,
  object: "token" | "comment"
) => {
  const { address } = useContext(WalletContext);
  const [error, setError] = useState('');

  const baseUrl = `/api/like/${object}/`;

  const { data: userLikesThisToken, mutate: mutateUserLikesThisToken } = useSWR(
    address && id ? [baseUrl + 'likes', address, id] : null,
    (url, address, id) => axios.get(`${url}?address=${address}&id=${id}`).then(r => Boolean(r.data.likes))
  );

  const toggleLike = async () => {
    if (!address) {
      return;
    }

    mutate(`/api/like/${object}/count`, old => userLikesThisToken ? old - 1 : old + 1, { revalidate: false });
    mutateUserLikesThisToken(old => !old, { revalidate: false })

    try {
      const r = await axios.post(
        baseUrl,
        { id },
        {
          headers: {
            'Accept': 'application/json'
          },
        }
      )

    } catch (error) {
      mutate(`/api/like/${object}/count`);
      mutateUserLikesThisToken();

      return { success: false, fileName: null, mimeType: null };
    }
  }

  return [userLikesThisToken, toggleLike, error, setError];
}