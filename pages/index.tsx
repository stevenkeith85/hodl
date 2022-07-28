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


export async function getServerSideProps({ req, res }) {
  await authenticate(req, res);

  let user = null;

  if (req.address) {
    user = await getUser(req.address)
  }

  const limit = 10;

  const prefetchedFeed = req.address ? [await getActions(req.address, ActionSet.Feed, 0, limit)] : null;
  const prefetchedTopUsers = [await getMostFollowedUsers(0, limit)];
  const prefetchedTopTokens = [await getMostLikedTokens(0, limit)];
  const prefetchedNewUsers = [await getUserSearchResults('', 0, limit)];

  return {
    props: {
      address: req.address || null,
      user,
      limit,
      prefetchedFeed,
      prefetchedTopUsers,
      prefetchedTopTokens,
      prefetchedNewUsers
    }
  }
}

export default function Home({ address, user, limit, prefetchedFeed, prefetchedTopUsers, prefetchedTopTokens, prefetchedNewUsers }) {
  const { actions: feed } = useActions(address, ActionSet.Feed, limit, prefetchedFeed);
  const { rankings: mostFollowed } = useRankings(true, limit, prefetchedTopUsers);
  const { rankings: mostLiked } = useRankings(true, limit, prefetchedTopTokens, "token");
  const { results: newUsers } = useSearchUsers('', limit, prefetchedNewUsers);

  return (
    <>
      <Head>
        <title>HodlMyMoon</title>
        <meta name="description" content="Mint, Showcase, and Trade NFTs at HodlMyMoon"></meta>
      </Head>

      <RankingsContext.Provider value={{
        mostFollowed,
        mostLiked,
        newUsers
      }}>
        {!address &&
          <Container maxWidth="xl">
            <PublicHomePage />
          </Container>
        }
        {address &&
          <FeedContext.Provider 
            value={{ feed }}>
            <Container maxWidth="xl">
              <PrivateHomePage user={user} address={address} />
            </Container>

          </FeedContext.Provider>
        }
      </RankingsContext.Provider>
    </>
  )
}