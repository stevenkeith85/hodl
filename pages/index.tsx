import Head from 'next/head';
import { Box, Grid, Typography } from '@mui/material';
import { HodlFeed } from '../components/feed/HodlFeed';
import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';


import { PublicHomePage } from '../components/layout/PublicHomePage';
import { HodlProfileBadge } from '../components/HodlProfileBadge';
import { useActions } from '../hooks/useActions';
import { ActionSet } from '../models/HodlAction';
import { FeedContext } from '../contexts/FeedContext';
import { useRankings } from '../hooks/useRankings';
import InfiniteScroll from 'react-swr-infinite-scroll';
import { HodlLoadingSpinner } from '../components/HodlLoadingSpinner';


// TODO
// export async function getServerSideProps() {

// }

export const TopAccounts = ({ limit = 10 }) => {
  const { rankings } = useRankings(true, limit);

  return (
    <Box>

      <Typography variant='h2' mb={2}>Top accounts</Typography>
      <Box
        display="grid"
        gap={1}
        gridTemplateColumns="1fr"
        sx={{ maxHeight: '300px' }}
      >
        {rankings.data &&
          <InfiniteScroll
            swr={rankings}
            loadingIndicator={<HodlLoadingSpinner />}
            isReachingEnd={rankings =>
              !rankings.data[0].items.length ||
              rankings.data[rankings.data.length - 1]?.items.length < limit
            }
          >
            {
              ({ items }) => items.map(({ address, followers }) => <Box display="flex" alignItems="center">
                <Box flexGrow={1} gap={4} display="flex">
                  <HodlProfileBadge address={address} minimized />
                </Box>{followers}</Box>)
            }
          </InfiniteScroll>
        }
      </Box>
    </Box>
  )
}

export default function Home({ limit = 4, prefetchedListed }) {
  const { address } = useContext(WalletContext);

  const { actions: feed } = useActions(address, ActionSet.Feed, limit);

  return (
    <FeedContext.Provider value={{ feed }}>
      <Head>
        <title>HodlMyMoon</title>
        <meta name="description" content="Mint, Showcase, and Trade NFTs at HodlMyMoon"></meta>
      </Head>

      {!address &&
        <PublicHomePage />
      }
      {address &&
        <Grid
          container
        >
          <Grid
            item xs={12}
            md={7}
          >
            <HodlFeed />
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
          >
            <Box display="grid" gap={8} paddingY={4} paddingX={8} gridTemplateColumns="1fr">
              <HodlProfileBadge address={address} />
              <TopAccounts />
            </Box>
          </Grid>
        </Grid>
      }
    </FeedContext.Provider>
  )
}

