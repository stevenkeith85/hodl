import { Box } from '@mui/material';
import Head from 'next/head';
import { HodlImpactAlert } from '../components/HodlImpactAlert';
import { InfiniteScrollNftWindows } from '../components/InfiniteScrollNftWindows';
import { useSearchTokens } from '../hooks/useSearchTokens';
import { authenticate } from '../lib/jwt';
import { getTokenSearchResults } from './api/search/tokens';


export async function getServerSideProps({ query, req, res }) {
  const { q = '' } = query;

  await authenticate(req, res);

  let prefetchedResults;

  const limit = 12;
  prefetchedResults = await getTokenSearchResults(q, 0, limit);
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
  const { results } = useSearchTokens(q, limit, prefetchedResults);

  return (
    <>
      <Head>
        <title>Explore · Hodl My Moon</title>
      </Head>

      {results?.data[0]?.total === 0 &&
        <HodlImpactAlert message={"We can't find anything at the moment"} title="Sorry" />
      }
      <Box paddingTop={4}>
        <InfiniteScrollNftWindows swr={results} limit={limit} />
      </Box>
    </>
  )
}

