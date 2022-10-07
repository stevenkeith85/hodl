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

  let user: UserViewModel = null;

  if (req.address) {
    user = await getUser(req.address, req.address);
  }

  const limit = 8;

  const feed = getActions(user?.address, ActionSet.Feed, 0, limit);
  const topUsers = getMostFollowedUsers(0, limit);
  const topTokens = getMostLikedTokens(0, limit);
  const newUsers = getNewUsers(0, limit, user?.address);
  const newTokens = getNewTokens(0, limit);
  const followingCount = getFollowingCount(user?.address);
  const followersCount = getFollowersCount(user?.address);

  // const start = new Date();
  // const stop = new Date();
  // console.log('time taken', stop - start);

  const [
    pfeed,
    ptopUsers,
    ptopTokens,
    pnewUsers,
    pnewTokens,
    pfollowingCount,
    pfollowersCount
  ] = await Promise.all([
    feed,
    topUsers,
    topTokens,
    newUsers,
    newTokens,
    followingCount,
    followersCount
  ]);

  return {
    props: {
      address: req.address || null,
      user,
      limit,
      prefetchedFeed: [pfeed],
      prefetchedTopUsers: [ptopUsers],
      prefetchedTopTokens: [ptopTokens],
      prefetchedNewUsers: [pnewUsers],
      prefetchedNewTokens: [pnewTokens],
      prefetchedFollowingCount: pfollowingCount,
      prefetchedFollowersCount: pfollowersCount
    }
  }
}

export default function Home({
  address,
  user,
  limit,
  prefetchedFeed,
  prefetchedTopUsers,
  prefetchedTopTokens,
  prefetchedNewUsers,
  prefetchedNewTokens,
  prefetchedFollowingCount,
  prefetchedFollowersCount
}) {

  const { rankings: mostFollowed } = useRankings(true, limit, prefetchedTopUsers);
  const { rankings: mostLiked } = useRankings(true, limit, null, "token");
  const { rankings: mostUsedTags } = useRankings(true, limit, null, "tag");

  const { results: newUsers } = useNewUsers(limit, prefetchedNewUsers);
  const { results: newTokens } = useNewTokens(limit, prefetchedNewTokens);

  const { actions: feed } = useActions(user?.address, ActionSet.Feed, limit, prefetchedFeed);

  const [hodlingCount] = useHodlingCount(user?.address, null);
  const [listedCount] = useListedCount(user?.address, null);

  const [followersCount] = useFollowersCount(user?.address, prefetchedFollowingCount);
  const [followingCount] = useFollowingCount(user?.address, prefetchedFollowersCount);

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