import Head from 'next/head';
import { InfiniteScrollSearchResults } from '../components/profile/InfiniteScrollSearchResults';
import { InfiniteScrollTab } from '../components/profile/InfiniteScrollTab';
import { useSearch } from '../hooks/useSearch';
import { SearchValidationSchema } from '../validationSchema/search';
import { getSearchResults } from './api/search/results';

export async function getServerSideProps({ query }) {
  const { q = '' } = query;

  let prefetchedResults;

  const limit = 4;
  const isValid = await SearchValidationSchema.isValid({ q })
  if (isValid) {
    prefetchedResults = await getSearchResults(q, 0, limit);
  } else {
    console.log('invalid search query')
    prefetchedResults = { items: [], next: 0, total: 0 };
  }
  return {
    props: {
      q,
      limit,
      prefetchedResults: [prefetchedResults]
    },
  }
}


export default function Search({ q, limit, prefetchedResults }) {
  const [swr] = useSearch(q, limit, prefetchedResults);

  return (
    <>
      <Head>
        <title>Mint, Showcase, and Trade NFTs | NFT Market | HodlMyMoon</title>
        <meta name="description" content="Mint, Showcase, and Trade NFTs at HodlMyMoon. Browse the Market Today!"></meta>
      </Head>
      <InfiniteScrollSearchResults swr={swr} limit={limit} />
    </>
  )
}

