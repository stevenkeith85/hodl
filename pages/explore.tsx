import { Typography } from '@mui/material';
import Head from 'next/head';
import { HodlImpactAlert } from '../components/HodlImpactAlert';
import { InfiniteScrollSearchResults } from '../components/profile/InfiniteScrollSearchResults';
import { useSearch } from '../hooks/useSearch';
import { authenticate } from '../lib/jwt';
import { SearchValidationSchema } from '../validationSchema/search';
import { getSearchResults } from './api/search/results';

export async function getServerSideProps({ query, req, res }) {
  console.log('getserevr propos')
  const { q = '' } = query;

  await authenticate(req, res);

  let prefetchedResults;

  const limit = 4;
  // const isValid = await SearchValidationSchema.isValid({ q })
  // console.log('valid', isValid)
  // if (isValid) {
    
    prefetchedResults = await getSearchResults(q, 0, limit);
  // } else {
  //   prefetchedResults = { items: [], next: 0, total: 0 };
  // }
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
  const [swr] = useSearch(q, limit, prefetchedResults);

  return (
    <>
      <Head>
        <title>Create, Showcase, and Trade NFTs | HodlMyMoon</title>
        <meta name="description" content="Create, Showcase, and Trade NFTs at HodlMyMoon. Browse the Market Today!"></meta>
      </Head>

      { swr?.data[0]?.total === 0 && 
      <HodlImpactAlert message={"We can't find anything at the moment"} title="Sorry" />        
      }
      <InfiniteScrollSearchResults swr={swr} limit={limit} />
    </>
  )
}

