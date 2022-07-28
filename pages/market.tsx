import Head from 'next/head';
import { getListed } from './api/market/listed';
import { useMarket } from '../hooks/useMarket';
import { InfiniteScrollTab } from '../components/profile/InfiniteScrollTab';
import { Box, Typography } from '@mui/material';
import { HodlImpactAlert } from '../components/HodlImpactAlert';
import { authenticate } from '../lib/jwt';


export async function getServerSideProps({ req, res }) {
  await authenticate(req, res);

  const limit = 12;
  const prefetchedListed = await getListed(0, limit);
  
  return {
    props: {
      address: req.address || null,
      limit,
      prefetchedListed: [prefetchedListed]
    },
  }
}

// TODO: We aren't using this at the moment.
// We'll likely make the explore page handle for sale items; so this will likely go
export default function Market({ limit, prefetchedListed }) {
  const [swr] = useMarket(limit, prefetchedListed);

  return (
    <>
      <Head>
        <title>Create, Showcase, and Trade NFTs | HodlMyMoon</title>
        <meta name="description" content="Mint, Showcase, and Trade NFTs at HodlMyMoon"></meta>
      </Head>
      <Box display="flex" marginY={2}>
        {swr?.data[0]?.total === 0 &&
          <HodlImpactAlert
            message={'We cannot find any NFTs listed on the market at the moment'} title={'Nothing to see here'}
          />
        }
        <InfiniteScrollTab swr={swr} limit={limit} />
      </Box>
    </>
  )
}

