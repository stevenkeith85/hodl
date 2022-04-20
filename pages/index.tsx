import { Box } from '@mui/material'
import Head from 'next/head';
import { InfiniteScroll } from '../components/InfiniteScroll'
import NftList from '../components/NftList'

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
  return (
    <>
      <Head>
        <title>NFT Market</title>
      </Head>
      <Box>
        { prefetchedListed && 
        <InfiniteScroll
          swrkey='fetchMarketItems'
          fetcher={
            async (offset, limit) => await fetch(`/api/market/listed?offset=${offset}&limit=${limit}`)
              .then(r => r.json())
              .then(json => json.data)}
          prefetchedData={prefetchedListed}
          revalidateOnMount={true}
          lim={lim}
          render={nfts => (
            <Box marginY={2}>
              <NftList
                nfts={nfts}
                viewSale={true}
                showTop={true}
                showName={false} />
            </Box>
          )} />
        }
      </Box>
    </>
  )
}
