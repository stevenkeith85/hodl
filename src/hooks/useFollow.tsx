import { useContext } from 'react';
import { mutate } from 'swr';
import axios from 'axios';
import { FollowersContext } from '../contexts/FollowersContext';
import { RankingsContext } from '../contexts/RankingsContext';
import { useUser } from './useUser';
import { FollowingContext } from '../contexts/FollowingContext';
import { SignedInContext } from '../contexts/SignedInContext';

// profileUser is the user SWR for the profileAddress. We want to mutate it when someone follows/unfollows them so that the UI updates in real time
export const useFollow = (profileAddress) => {
  const { signedInAddress: address } = useContext(SignedInContext);

  // Logged in user values. TODO: Migrate this to the user view model
  const user = useUser(address, null, address); // TODO: Once we add the counts to the UserViewModel, we can just mutate that. (simpler)

  // The profile owner needs mutated as we use their info to determine if the user follows them
  const profileOwner = useUser(profileAddress, null, address);

  // If the user starts to follow the profile owner, the profile owners followers will change
  const { followers } = useContext(FollowersContext);

  // If the user starts unfollows the profile owner, the profile owners following will change
  const { following } = useContext(FollowingContext);

  // The most followed users list will change
  const { mostFollowed } = useContext(RankingsContext);


  // TODO: We'll likely consolidate a few things into the UserViewModel, which should make updates simpler
  const follow = async () => {

    // The profile owner has been followed or unfollowed. preemptively mutate the ui
    if (profileOwner) {
      mutate(['/api/followers/count', profileOwner.data.address], old => profileOwner.data.followedByViewer ? old - 1 : old + 1, { revalidate: false }) // the profile owner WAS followed by the user; so we'll decrement the count as it will be an unfollow
      profileOwner.mutate(old => ({ ...old, followedByViewer: !old.followedByViewer }), { revalidate: false });
    }

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

      // The users data needs updated
      if (user) {
        mutate([`/api/following/count`, user.data.address])
      }

      if (followers) {
        followers.mutate();
      }

      if (following) {
        following.mutate();
      }

      // The rankings need updated
      if (mostFollowed) {
        mostFollowed.mutate();
      }

      return true;

    } catch (error) {
      console.log(error);

      mutate(['/api/followers/count', profileOwner.data.address]);
      profileOwner.mutate();

      if (error?.response?.status === 429) {
        // TODO: If we preemptively mutate anything, we should undo it here
        return false;
      }
    }
  }

  return [follow];
}