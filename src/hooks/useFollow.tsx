import { useContext } from 'react';
import { mutate } from 'swr';
import { WalletContext } from '../contexts/WalletContext';
import axios from 'axios';
import { FeedContext } from '../contexts/FeedContext';
import { FollowersContext } from '../contexts/FollowersContext';
import { RankingsContext } from '../contexts/RankingsContext';
import { useUser } from './useUser';

// profileUser is the user SWR for the profileAddress. We want to mutate it when someone follows/unfollows them so that the UI updates in real time
export const useFollow = (profileAddress) => {
  const { address } = useContext(WalletContext);

  // Logged in user values. TODO: Migrate this to the user view model
  // const { followingCount} = useContext(UserContext)
  const user = useUser(address); // TODO: Once we add the counts to the UserViewModel, we can just mutate that. (simpler)

  // The profile owner needs mutated as we use their info to determine if the user follows them
  const profileOwner = useUser(profileAddress);

  // If the user starts to follow the profile owner, the user's feed should be refreshed (as it will have new content)
  const { feed } = useContext(FeedContext);

  // If the user starts to follow the profile owner, the profile owners follower count will change
  const { followers } = useContext(FollowersContext);

  // The most followed users list will change
  const { mostFollowed } = useContext(RankingsContext);


  // TODO: We'll likely consolidate a few things into the UserViewModel, which should make updates simpler
  const follow = async () => {

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

      // The profile owners data needs updated
      if (profileOwner) {
        profileOwner.mutate();
        mutate(['/api/followers/count', profileOwner.data.address])
      }
      
      if (followers) {
        followers.mutate();
      }

      // The users data needs updated
      if (user) {
        mutate([`/api/following/count`, user.data.address])
      }

      if (feed) {
        feed.mutate();
      }

      // The rankings need updated
      if (mostFollowed) {
        mostFollowed.mutate();
      }

      return true;

    } catch (error) {
      if (error.response.status === 429) {
        // TODO: If we preemptively mutate anything, we should undo it here
        return false;
      }
    }
  }

  return [follow];
}