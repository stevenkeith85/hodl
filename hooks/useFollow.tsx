import { useContext } from 'react';
import useSWR, { mutate } from 'swr';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios';

export const useFollow = (profileAddress) => {
  const { address } = useContext(WalletContext);

  const { data: isFollowing, mutate: mutateIsFollowing } = useSWR(address && address !== profileAddress ? [`/api/follow/follows`, address, profileAddress] : null,
    (url, address, profileAddress) => axios.get(`${url}?address1=${address}&address2=${profileAddress}`)
      .then(r => Boolean(r.data.follows))
  );

  const follow = async () => {
    mutate([`/api/follow/followersCount`, profileAddress],
      async ({ count }) => {
        return ({ count: isFollowing ? count - 1 : count + 1 })
      },
      { revalidate: false });

    mutate([`/api/follow/followers`, profileAddress],
      async ({ followers }) => {
        return ({ followers: isFollowing ? (followers || []).filter(a => a !== address) : [...(followers || []), address] })
      },
      { revalidate: false });

    mutateIsFollowing(old => !old, { revalidate: false });

    try {
      const r = await axios.post(
        '/api/follow/follow',
        { address: profileAddress },
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('jwt')
          },
        }
      )
      return true;
    } catch (error) {
      if (error.response.status === 429) {
        mutate([`/api/follow/followersCount`, profileAddress]);
        mutate([`/api/follow/followers`, profileAddress]);
        mutateIsFollowing();
        return false;
      }
    }
  }

  return [follow, isFollowing];
}