import Head from 'next/head';

import { PublicHomePage } from '../components/layout/PublicHomePage';
import { PrivateHomePage } from '../components/layout/PrivateHomePage';
import { authenticate } from '../lib/jwt';
import { FeedContext } from '../contexts/FeedContext';
import { useActions } from '../hooks/useActions';
import { ActionSet } from '../models/HodlAction';
import { Container } from '@mui/material';
import { getActions } from './api/actions';
import { useRankings } from '../hooks/useRankings';
import { getMostFollowedUsers } from './api/rankings/user';
import { RankingsContext } from '../contexts/RankingsContext';
import { getUser } from './api/user/[handle]';
import { getMostLikedTokens } from './api/rankings/token';
import { useNewUsers } from '../hooks/useNewUsers';

import { UserContext } from '../contexts/UserContext';
import { useFollowersCount } from '../hooks/useFollowersCount';
import { useFollowingCount } from '../hooks/useFollowingCount';
import { useHodlingCount } from '../hooks/useHodlingCount';
import { useListedCount } from '../hooks/useListedCount';
import { getFollowingCount } from './api/following/count';
import { getFollowersCount } from './api/followers/count';
import { UserViewModel } from '../models/User';
import { getNewUsers } from './api/rankings/user/new';
import { getNewTokens } from './api/rankings/token/new';
import { useNewTokens } from '../hooks/useNewTokens';


export async function getServerSideProps({ req, res }) {
  await authenticate(req, res);

  const limit = 10;

  if (!req.address) {
    return {
      props: {
        address: null,
        user: null,
        limit,
        prefetchedFeed: null
      }
    }
  }
  
  const userPromise = getUser(req.address, req.address);
  const feed = getActions(req.address, ActionSet.Feed, 0, 3); 
  
  const [
    user,
    pfeed,
  ] = await Promise.all([
    userPromise,
    feed,
  ]);

  return {
    props: {
      address: req.address || null,
      user,
      limit,
      prefetchedFeed: [pfeed],
    }
  }
}

export default function Home({
  address,
  user,
  limit,
  prefetchedFeed,
}) {

  const { rankings: mostFollowed } = useRankings(true, limit, null);
  const { rankings: mostLiked } = useRankings(true, limit, null, "token");
  const { rankings: mostUsedTags } = useRankings(true, limit, null, "tag");

  const { results: newUsers } = useNewUsers(limit, null);
  const { results: newTokens } = useNewTokens(limit, null);

  const { actions: feed } = useActions(user?.address, ActionSet.Feed, limit, prefetchedFeed);

  const [hodlingCount] = useHodlingCount(user?.address, null);
  const [listedCount] = useListedCount(user?.address, null);

  const [followersCount] = useFollowersCount(user?.address, null);
  const [followingCount] = useFollowingCount(user?.address, null);

  return (
    <>
      <Head>
        <title>Hodl My Moon</title>
      </Head>

      <RankingsContext.Provider value={{
        limit,
        mostFollowed,
        mostLiked,
        mostUsedTags,
        newUsers,
        newTokens
      }}>
        {!address &&
          <Container maxWidth="xl">
            <PublicHomePage />
          </Container>
        }
        {address &&
          <FeedContext.Provider
            value={{ feed }}>
            <UserContext.Provider
              value={{
                hodlingCount,
                listedCount,
                followersCount,
                followingCount
              }}
            >
              <Container maxWidth="xl">
                <PrivateHomePage user={user} address={address} />
              </Container>
            </UserContext.Provider>
          </FeedContext.Provider>
        }
      </RankingsContext.Provider>
    </>
  )
}