import { useState, useContext } from 'react';
import useSWR from 'swr';
import { hasExpired } from '../lib/utils';
import { WalletContext } from '../contexts/WalletContext';
import { useConnect } from './useConnect';

export const useLike = (tokenId) => {
  const { address } = useContext(WalletContext);
  const [error, setError] = useState('');
  const [connect] = useConnect();

  const { data: tokenLikesCount, mutate: mutateLikesCount } = useSWR(tokenId ? [`/api/like/likeCount`, tokenId] : null,
    (url, tokenId) => fetch(`${url}?token=${tokenId}`)
      .then(r => r.json())
      .then(json => json.count));

  const { data: userLikesThisToken, mutate: mutateUserLikesThisToken } = useSWR(address && tokenId ? [`/api/like/likes`, address, tokenId] : null,
    (url, address, tokenId) => fetch(`${url}?address=${address}&token=${tokenId}`)
      .then(r => r.json())
      .then(json => Boolean(json.likes)));

  const toggleLike = async () => {

    if (hasExpired(localStorage.getItem('jwt'))) {
      if (!(await connect(true, true))) {
        return; // couldn't connect
      }
    }

    mutateLikesCount(old => userLikesThisToken ? old-1 : old+1, { revalidate: false }); // TODO: Try to do this before the network call
    mutateUserLikesThisToken(old => !old, { revalidate: false })

    const r = await fetch('/api/like/like', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('jwt')
      }),
      body: JSON.stringify({ token: tokenId })
    });

    if (r.status === 429) {
      mutateLikesCount();
      mutateUserLikesThisToken();
      const { message } = await r.json();
      setError(message);
    } else if (r.status === 403) {
      mutateLikesCount();
      mutateUserLikesThisToken();
      await connect(false);
    }
  }

  return [tokenLikesCount, userLikesThisToken, toggleLike, error, setError];
}