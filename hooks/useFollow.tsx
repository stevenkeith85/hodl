import { useContext } from 'react';
import useSWR, { mutate } from 'swr';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios';


export const useFollow = (profileAddress, feed = null, followers = null, following = null) => {
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

    // This is on the profile page
    mutate([`/api/followers/count`, profileAddress],
      (data) => {
        if (data === undefined) { // we've not fetched this yet, so no need to mutate. i.e. its not on screen
          return data
        }

        const { count } = data;

        return ({ count: isFollowing ? count - 1 : count + 1 })
      },
      {
        revalidate: false
      });


    // This is on the feed page
    mutate([`/api/following/count`, address],
      (data) => {
        if (data === undefined) { // we've not fetched this yet, so no need to mutate. i.e. its not on screen
          return data
        }

        const { count } = data;

        console.log('user following', count);
        return ({ count: isFollowing ? count - 1 : count + 1 })
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

      // This is on the feed page
      if (feed) {
        feed.mutate();
      }

      // This is on the profile page
      if (followers) {
        followers.mutate();
      }

      // This isn't needed on the profile or feed page at the moment. 
      // Leaving here for completeness
      // if (following) {
      //   following.mutate();
      // }

      return true;

    } catch (error) {
      if (error.response.status === 429) {
        mutate([`/api/followers/count`, profileAddress]);
        mutate([`/api/following/count`, address]);
        mutateIsFollowing();

        if (followers) {
          followers.mutate();
        }

        // if (following) {
        //   following.mutate();
        // }

        if (feed) {
          feed.mutate();
        }

        return false;
      }
    }
  }

  return [follow, isFollowing];
}