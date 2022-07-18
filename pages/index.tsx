import Head from 'next/head';
import { Box, Grid, Typography } from '@mui/material';
import { HodlFeed } from '../components/feed/HodlFeed';
import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';


import { PublicHomePage } from '../components/layout/PublicHomePage';
import { HodlProfileBadge } from '../components/HodlProfileBadge';


// TODO
// export async function getServerSideProps() {

// }


export default function Home({ limit, prefetchedListed }) {
  const { address } = useContext(WalletContext);




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
          // sx={{ background: 'yellow' }}
          >
            <Box display="grid" gap={8} paddingY={4} paddingX={8} gridTemplateColumns="1fr">
              <HodlProfileBadge address={address} />
              <Box>
                <Typography variant='h2' mb={2}>Top accounts</Typography>
                <Box display="grid" gap={1} gridTemplateColumns="1fr">
                  <HodlProfileBadge address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" minimized />
                  <HodlProfileBadge address="0x70997970C51812dc3A010C7d01b50e0d17dc79C8" minimized />
                  <HodlProfileBadge address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" minimized />
                  <HodlProfileBadge address="0x70997970C51812dc3A010C7d01b50e0d17dc79C8" minimized />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      }
    </>
  )
}

