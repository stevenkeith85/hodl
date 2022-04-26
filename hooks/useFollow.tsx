import { useContext, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { hasExpired } from '../lib/utils';
import { WalletContext } from '../contexts/WalletContext';
import { useConnect } from './useConnect';

export const useFollow = (profileAddress) => {
  const { address } = useContext(WalletContext);
  const [connect] = useConnect();
  const [error, setError] = useState('');

  const { data: isFollowing, mutate: mutateIsFollowing } = useSWR(address && address !== profileAddress ? [`/api/follow/follows`, address, profileAddress] : null,
    (url, address, profileAddress) => fetch(`${url}?address1=${address}&address2=${profileAddress}`)
      .then(r => r.json())
      .then(json => Boolean(json.follows)),
  );

  const follow = async () => {
    if (hasExpired(localStorage.getItem('jwt'))) {
      await connect(true, true);
    }

    mutate([`/api/follow/followersCount`, profileAddress],
      async ({count}) => {
        return ({count: isFollowing ? count - 1 : count + 1})
      },
      { revalidate: false });

    mutate([`/api/follow/followers`, profileAddress],
      async ({followers}) => {
        return ({followers: isFollowing ? (followers || []).filter(a => a !== address) : [...(followers || []), address]})
      },
      { revalidate: false });

    mutateIsFollowing(old => !old, { revalidate: false });

    const r = await fetch('/api/follow/follow', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('jwt')
      }),
      body: JSON.stringify({ address: profileAddress })
    });

    if (r.status === 429) {
      const { message } = await r.json();
      setError(message);
      mutate([`/api/follow/followersCount`, profileAddress]);
      mutate([`/api/follow/followers`, profileAddress]);
      mutateIsFollowing();
      return false;
    } else if (r.status === 403) {
      await connect(false);
      mutate([`/api/follow/followersCount`, profileAddress]);
      mutate([`/api/follow/followers`, profileAddress]);
      mutateIsFollowing();
      return false;
    } else if (r.status === 200) {
      return true;
    }
  }


  return [follow, isFollowing, error, setError];
}