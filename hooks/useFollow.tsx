import { useContext } from 'react';
import useSWR, { mutate } from 'swr';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios';
import { ActionTypes } from '../models/HodlAction';

export const useFollow = (profileAddress) => {
  const { address } = useContext(WalletContext);

  const { data: isFollowing, mutate: mutateIsFollowing } = useSWR(address && address !== profileAddress ? [`/api/follow2/follows`, address, profileAddress] : null,
    (url, address, profileAddress) => axios.get(`${url}?address1=${address}&address2=${profileAddress}`)
      .then(r => Boolean(r.data.follows)),
    {
      revalidateOnMount: true
    }
  );

  const follow = async () => {
    // Update person followed values
    mutate([`/api/follow2/followersCount`, profileAddress],
      async ({ count }) => {
        return ({ count: isFollowing ? count - 1 : count + 1 })
      },
      {
        revalidate: false
      });

    mutate([`/api/follow2/followers`, profileAddress],
      async ({ followers }) => {
        return ({ followers: isFollowing ? (followers || []).filter(a => a !== address) : [address, ...(followers || [])] })
      },
      {
        revalidate: false
      });

    mutateIsFollowing(old => !old, { revalidate: false });

    // Update users values
    mutate([`/api/follow2/followingCount`, address],
      async ({ count }) => {
        return ({ count: isFollowing ? count - 1 : count + 1 })
      },
      {
        revalidate: false
      });

    mutate([`/api/follow2/following`, address],
      async ({ following }) => {
        return ({ 
          following: isFollowing ? 
                      (following || []).filter(a => a !== profileAddress) : 
                      [profileAddress, ...(following || [])] 
        })
      },
      {
        revalidate: false
      });

    try {
      const r = await axios.post(
        '/api/follow2/follow',
        { address: profileAddress },
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('jwt')
          },
        }
      )

      

      mutate([`/api/actions`, 'feed', 0, 4], address);

      return true;

    } catch (error) {
      if (error.response.status === 429) {
        mutate([`/api/follow2/followersCount`, profileAddress]);
        mutate([`/api/follow2/followers`, profileAddress]);
        
        mutateIsFollowing();

        mutate([`/api/follow2/followingCount`, address]);
        mutate([`/api/follow2/following`, address]);

        return false;
      }
    }
  }

  return [follow, isFollowing];
}