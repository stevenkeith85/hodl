import { Box } from '@mui/material'
import { InfiniteScroll } from '../components/InfiniteScroll'

export async function getServerSideProps() {
  
  const prefetchedListed = await fetch(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/market/listed?offset=0&limit=20`)
                                    .then(r => r.json())
                                    .then(json => json.data)
  return {
    props: {
      prefetchedListed: [prefetchedListed],
    },
  }
}


export default function Home({ prefetchedListed }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", paddingTop:{ xs: 0, md: 2} }}>
      <InfiniteScroll 
          swrkey='fetchMarketItems'
          fetcher={
            async (offset, limit) => await fetch(`/api/market/listed?offset=${offset}&limit=${limit}`)
                                            .then(r => r.json())
                                            .then(json => json.data)
          } 
          viewSale={true}
          showTop={true}
          showName={false}
          prefetchedData={prefetchedListed}
           />
    </Box>
  ) 
}
