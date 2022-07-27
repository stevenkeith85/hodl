import Head from 'next/head';
import { HodlImpactAlert } from '../components/HodlImpactAlert';
import { InfiniteScrollSearchResults } from '../components/profile/InfiniteScrollSearchResults';
import { useSearchTokens } from '../hooks/useSearchTokens';
import { authenticate } from '../lib/jwt';
import { getSearchResults } from './api/search/tokens';


export async function getServerSideProps({ query, req, res }) {
  const { q = '' } = query;

  await authenticate(req, res);

  let prefetchedResults;

  const limit = 10;    
    prefetchedResults = await getSearchResults(q, 0, limit);
  return {
    props: {
      address: req.address || null,
      q,
      limit,
      prefetchedResults: [prefetchedResults]
    },
  }
}


export default function Search({ q, limit, prefetchedResults }) {
  const {results } = useSearchTokens(q, limit, prefetchedResults);

  return (
    <>
      <Head>
        <title>Create, Showcase, and Trade NFTs | HodlMyMoon</title>
        <meta name="description" content="Create, Showcase, and Trade NFTs at HodlMyMoon. Browse the Market Today!"></meta>
      </Head>

      { results?.data[0]?.total === 0 && 
      <HodlImpactAlert message={"We can't find anything at the moment"} title="Sorry" />        
      }
      <InfiniteScrollSearchResults swr={results} limit={limit} />
    </>
  )
}

