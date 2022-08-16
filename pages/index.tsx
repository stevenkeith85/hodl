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
import { useSearchUsers } from '../hooks/useSearchUsers';
import { getUserSearchResults } from './api/search/users';
import { getTokenSearchResults } from './api/search/tokens';
import { useSearchTokens } from '../hooks/useSearchTokens';
import { UserContext } from '../contexts/UserContext';
import { useFollowersCount } from '../hooks/useFollowersCount';
import { useFollowingCount } from '../hooks/useFollowingCount';
import { useHodlingCount } from '../hooks/useHodlingCount';
import { useListedCount } from '../hooks/useListedCount';
import { getHodlingCount } from './api/profile/hodlingCount';
import { getListedCount } from './api/profile/listedCount';
import { getFollowingCount } from './api/following/count';
import { getFollowersCount } from './api/followers/count';
import { UserViewModel } from '../models/User';


export async function getServerSideProps({ req, res }) {
  await authenticate(req, res);

  let user: UserViewModel = null;

  if (req.address) {
    user = await getUser(req.address, req.address)
  }

  const limit = 8;

  const feed = getActions(user?.address, ActionSet.Feed, 0, limit);

  const topUsers = getMostFollowedUsers(0, limit);
  const topTokens = getMostLikedTokens(0, limit);
  const newUsers = getUserSearchResults('', 0, limit);
  const newTokens = getTokenSearchResults('', 0, limit);

  const hodlingCount = getHodlingCount(user?.address);
  const listedCount = getListedCount(user?.address);
  const followingCount = getFollowingCount(user?.address);
  const followersCount = getFollowersCount(user?.address);

  const [
    pfeed,
    ptopUsers,
    ptopTokens,
    pnewUsers,
    pnewTokens,
    phodlingCount,
    plistedCount,
    pfollowingCount,
    pfollowersCount
  ] = await Promise.all([
    feed,
    topUsers,
    topTokens,
    newUsers,
    newTokens,
    hodlingCount,
    listedCount,
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
      prefetchedHodlingCount: phodlingCount,
      prefetchedListedCount: plistedCount,
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
  prefetchedHodlingCount,
  prefetchedListedCount,
  prefetchedFollowingCount,
  prefetchedFollowersCount
}) {

  // return (<><h1>{JSON.stringify(user)}</h1></>)
  const { rankings: mostFollowed } = useRankings(true, limit, prefetchedTopUsers);
  const { rankings: mostLiked } = useRankings(true, limit, null, "token");
  const { results: newUsers } = useSearchUsers('', limit, prefetchedNewUsers);
  const { results: newTokens } = useSearchTokens('', limit, prefetchedNewTokens);

  const { actions: feed } = useActions(user?.address, ActionSet.Feed, limit, prefetchedFeed);

  const [hodlingCount] = useHodlingCount(user?.address, prefetchedHodlingCount);
  const [listedCount] = useListedCount(user?.address, prefetchedListedCount);

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