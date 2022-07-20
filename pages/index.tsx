import Head from 'next/head';

import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';

import { PublicHomePage } from '../components/layout/PublicHomePage';
import { PrivateHomePage } from '../components/layout/PrivateHomePage';

import { Redis } from '@upstash/redis';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { accessTokenExpiresIn, authenticate } from '../lib/jwt';
import { FeedContext } from '../contexts/FeedContext';
import { useActions } from '../hooks/useActions';
import { ActionSet } from '../models/HodlAction';
import { Container } from '@mui/material';
import ResponsiveAppBar from '../components/layout/AppBar';
import { getActions } from './api/actions';
import { useRankings } from '../hooks/useRankings';
import { getMostFollowedUsers } from './api/rankings';
import { RankingsContext } from '../contexts/RankingsContext';

// dotenv.config({ path: '.env' })

export async function getServerSideProps({ req, res }) {
  await authenticate(req, res);

  const limit = 4;

  const prefetchedFeed = req.address ? [await getActions(req.address, ActionSet.Feed, 0, limit)] : null;
  const prefetchedTopAccounts = req.address ? [await getMostFollowedUsers(0, limit)] : null;

  return {
    props: {
      address: req.address || null,
      limit,
      prefetchedFeed,
      prefetchedTopAccounts
    }
  }
}

export default function Home({ address, limit, prefetchedFeed, prefetchedTopAccounts }) {
  const { actions: feed } = useActions(address, ActionSet.Feed, limit, prefetchedFeed);
  const { rankings } = useRankings(true, limit, prefetchedTopAccounts);

  return (
    <>
      <Head>
        <title>HodlMyMoon</title>
        <meta name="description" content="Mint, Showcase, and Trade NFTs at HodlMyMoon"></meta>
      </Head>

      {!address &&
        <PublicHomePage />
      }
      {address &&
        <FeedContext.Provider value={{ feed }}>
          <RankingsContext.Provider value={{ rankings }}>
            <PrivateHomePage address={address} />
          </RankingsContext.Provider>
        </FeedContext.Provider>
      }
    </>
  )
}