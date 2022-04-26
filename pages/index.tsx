import Head from 'next/head';
import { getListed } from './api/market/listed';
import { useMarket } from '../hooks/useMarket';
import { InfiniteScrollTab } from '../components/profile/InfiniteScrollTab';

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
        <title>HodlMyMoon | Mint, Showcase, and Trade NFTs | NFT Market</title>
        <meta name="description" content="Mint, Showcase, and Trade NFTs at HodlMyMoon. Browse the Market Today!"></meta>
      </Head>
      <InfiniteScrollTab swr={swr} limit={limit} />
    </>
  )
}

