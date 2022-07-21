import { useContext } from 'react';
import useSWR, { mutate } from 'swr';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios';

export const useFollow = (profileAddress, feed = null) => {
  const { address } = useContext(WalletContext);

  const fetcher = (url, address, profileAddress) => axios.get(`${url}?address1=${address}&address2=${profileAddress}`).then(r => Boolean(r.data.follows));

  const {
    data: isFollowing,
    mutate: mutateIsFollowing } = useSWR(
      address && address !== profileAddress ? [`/api/follows`, address, profileAddress] : null,
      fetcher,
      {
        revalidateOnMount: true
      }
    );

  const follow = async () => {
    // Update person followed values
    mutate([`/api/followers/count`, profileAddress],
      (data) => {

        if (data === undefined) { // we've not fetched this yet, so no need to mutate. i.e. its not on screen
          return data
        }

        const {count} = data;

        console.log('profile address followersCount', count);
        return ({ count: isFollowing ? count - 1 : count + 1 })
      },
      {
        revalidate: false
      });

      // TODO: Now SWR infinite, so needs updated
    // mutate([`/api/followers`, profileAddress],
    //   (data) => {

    //     if (data === undefined) { // we've not fetched this yet, so no need to mutate. i.e. its not on screen
    //       return data;
    //     }

    //     const { followers } = data;

    //     console.log('profile address followers', followers);
    //     return ({followers: isFollowing ? followers.filter(follower => follower !== address) :
    //                          [address, ...followers]})
    //   },
    //   {
    //     revalidate: false
    //   });

    

    // Update users values
    mutate([`/api/following/count`, address],
      (data) => {
        if (data === undefined) { // we've not fetched this yet, so no need to mutate. i.e. its not on screen
          return data
        }

        const {count} = data;

        console.log('user following', count);
        return ({ count: isFollowing ? count - 1 : count + 1 })
      },
      {
        revalidate: false
      });

    mutate([`/api/following`, address],
      (data) => {
        if (data === undefined) { // we've not fetched this yet, so no need to mutate. i.e. its not on screen
          return data;
        }

        const { following } = data;

        return ({ following: isFollowing ? following.filter(f => f !== profileAddress) :
                                          [profileAddress, ...following]})
      },
      {
        revalidate: false
      });

    mutateIsFollowing(old => !old, { revalidate: false });

    try {
      const r = await axios.post(
        '/api/follow',
        { address: profileAddress },
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      )

      if (feed) {
        feed.mutate();
      }

      return true;

    } catch (error) {
      if (error.response.status === 429) {
        mutate([`/api/followers/count`, profileAddress]);
        mutate([`/api/followers`, profileAddress]);

        mutateIsFollowing();

        mutate([`/api/following/count`, address]);
        mutate([`/api/following`, address]);

        return false;
      }
    }
  }

  return [follow, isFollowing];
}