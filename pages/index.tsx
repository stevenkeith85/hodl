import Head from 'next/head';
import { getListed } from './api/market/listed';
import { useMarket } from '../hooks/useMarket';
import { InfiniteScrollTab } from '../components/profile/InfiniteScrollTab';
import { Typography } from '@mui/material';

export async function getServerSideProps() {
  const limit = 12;
  const prefetchedListed = await getListed(0, limit);
  return {
    props: {
      limit,
      prefetchedListed: [prefetchedListed]
    },
  }
}


export default function Home({ limit, prefetchedListed }) {
  const [swr] = useMarket(limit, prefetchedListed);

  return (
    <>
      <Head>
        <title>Create, Showcase, and Trade NFTs | HodlMyMoon</title>
        <meta name="description" content="Mint, Showcase, and Trade NFTs at HodlMyMoon"></meta>
      </Head>
      { swr?.data[0]?.total === 0 && 
        <Typography marginY={2}>We cannot find any NFTs listed on the market at the moment</Typography>
      }
      <InfiniteScrollTab swr={swr} limit={limit} />
    </>
  )
}

