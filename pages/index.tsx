import { Box } from '@mui/material'
import Head from 'next/head';

import NftList from '../components/NftList'
import useSWRInfinite from 'swr/infinite'
import InfiniteScroll from 'react-swr-infinite-scroll'
import { HodlLoadingSpinner } from '../components/HodlLoadingSpinner';


export async function getServerSideProps() {
  const lim = 16;
  const prefetchedListed = await fetch(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/market/listed?offset=0&limit=${lim}`)
    .then(r => r.json())
    .then(json => json.data)
  return {
    props: {
      lim,
      prefetchedListed: prefetchedListed ? [prefetchedListed] : null,
    },
  }
}


export default function Home({ lim, prefetchedListed }) {

  const getKey = (index, previous) => {
    return ['market', index * lim, lim];
  }

  const fetcher =  async (key, offset, limit) => await fetch(`/api/market/listed?offset=${offset}&limit=${limit}`)
                                                        .then(r => r.json())
                                                        .then(json => json.data);
  const swr = useSWRInfinite(getKey, fetcher, { fallbackData: prefetchedListed });
    
  return (
    <>
      <Head>
        <title>NFT Market</title>
      </Head>
      <Box>
        <InfiniteScroll
                swr={swr}
                loadingIndicator={<HodlLoadingSpinner />}
                isReachingEnd={swr => swr.data?.[0]?.items.length === 0 || swr.data?.[swr.data?.length - 1]?.items.length < lim } 
                 >
        {
          ({ items }) => 
          <Box marginY={2}>
              <NftList
                nfts={items}
                viewSale={true}
                showTop={true}
                showName={false} />
            </Box>
        }
        </InfiniteScroll>
      </Box>
    </>
  )
}

