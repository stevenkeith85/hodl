import { useContext } from 'react';
import useSWR, { mutate } from 'swr';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios';
import { FeedContext } from '../contexts/FeedContext';
import { FollowersContext } from '../contexts/FollowersContext';
import { FollowingContext } from '../contexts/FollowingContext';
import { RankingsContext } from '../contexts/RankingsContext';


export const useFollow = (profileAddress) => {
  const { address } = useContext(WalletContext);
  
  const { feed } = useContext(FeedContext);

  const { followers } = useContext(FollowersContext);

  const { mostFollowed } = useContext(RankingsContext);

  const fetcher = (url, address, profileAddress) => axios.get(`${url}?address1=${address}&address2=${profileAddress}`).then(r => Boolean(r.data.follows));

  const {
    data: isFollowing,
    mutate: mutateIsFollowing } = useSWR(
      address && address !== profileAddress ? [`/api/follows`, address, profileAddress] : null,
      fetcher
    );

  const follow = async () => {

    // This is on the profile page
    mutate([`/api/followers/count`, profileAddress],
      (data) => {
        if (data === undefined) { // we've not fetched this yet, so no need to mutate. i.e. its not on screen
          return data
        }

        return isFollowing ? data - 1 : data + 1;
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

        return isFollowing ? data - 1 : data + 1;
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

      // This is on the feed page
      if (mostFollowed) {
        mostFollowed.mutate();
      }

      // This is on the profile page
      if (followers) {
        followers.mutate();
      }

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