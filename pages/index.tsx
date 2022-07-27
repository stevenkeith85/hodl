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


export async function getServerSideProps({ req, res }) {
  await authenticate(req, res);

  const limit = 4;

  const prefetchedFeed = req.address ? [await getActions(req.address, ActionSet.Feed, 0, limit)] : null;
  const prefetchedTopUsers = req.address ? [await getMostFollowedUsers(0, limit)] : null;

  return {
    props: {
      address: req.address || null,
      limit,
      prefetchedFeed,
      prefetchedTopUsers
    }
  }
}

export default function Home({ address, limit, prefetchedFeed, prefetchedTopUsers }) {
  const { actions: feed } = useActions(address, ActionSet.Feed, limit, prefetchedFeed);
  const { rankings: mostFollowed } = useRankings(true, limit, prefetchedTopUsers);
  const { rankings: mostLiked } = useRankings(true, limit, null, "token");

  return (
    <>
      <Head>
        <title>HodlMyMoon</title>
        <meta name="description" content="Mint, Showcase, and Trade NFTs at HodlMyMoon"></meta>
      </Head>

      <RankingsContext.Provider value={{
        mostFollowed,
        mostLiked
      }}>
        {!address &&
          <Container maxWidth="xl">
            <PublicHomePage />
          </Container>

        }
        {address &&
          <FeedContext.Provider value={{ feed }}>
            <Container maxWidth="xl">
              <PrivateHomePage address={address} />
            </Container>

          </FeedContext.Provider>
        }
      </RankingsContext.Provider>
    </>
  )
}