import Head from 'next/head';
import dynamic from 'next/dynamic';

import { authenticate } from '../lib/jwt';
import { FeedContext } from '../contexts/FeedContext';
import { useActions } from '../hooks/useActions';
import { ActionSet } from '../models/HodlAction';
import { getActions } from './api/actions';
import { useRankings } from '../hooks/useRankings';
import { RankingsContext } from '../contexts/RankingsContext';
import { getUser } from './api/user/[handle]';
import { useNewUsers } from '../hooks/useNewUsers';
import { UserContext } from '../contexts/UserContext';
import { useFollowersCount } from '../hooks/useFollowersCount';
import { useFollowingCount } from '../hooks/useFollowingCount';
import { useHodlingCount } from '../hooks/useHodlingCount';
import { useListedCount } from '../hooks/useListedCount';
import { useNewTokens } from '../hooks/useNewTokens';

import PublicHomePageLoading from '../components/layout/PublicHomeLoading';
import PrivateHomePageLoading from '../components/layout/PrivateHomePageLoading';


const PublicHomePage = dynamic(
  () => import('../components/layout/PublicHomePage'),
  {
    ssr: false,
    loading: () => <PublicHomePageLoading />
  }
);


const PrivateHomePage = dynamic(
  () => import('../components/layout/PrivateHomePage'),
  {
    ssr: false,
    loading: () => <PrivateHomePageLoading />
  }
);


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
  const feed = getActions(req.address, ActionSet.Feed, 0, limit);

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

  const { rankings: mostLiked } = useRankings(true, limit, null, "token");
  const { rankings: mostFollowed } = useRankings(true, limit, null);

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
        newUsers,
        newTokens
      }}>
        {!address &&
          <PublicHomePage />
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
              {/* @ts-ignore */}
              <PrivateHomePage user={user} address={address} />
              {/* <PrivateHomePageLoading /> */}
            </UserContext.Provider>
          </FeedContext.Provider>
        }
      </RankingsContext.Provider>
    </>
  )
}
