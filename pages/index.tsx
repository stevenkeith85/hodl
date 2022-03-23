/* pages/index.js */
import { fetchMarketItems } from '../lib/nft.js'
import { Alert, Box, Stack, Typography } from '@mui/material'
import { InfiniteScroll } from '../components/InfiniteScroll'


export default function Home() {
  return (
    <>
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", paddingTop:{ xs: 0, md: 2} }}>
      <InfiniteScroll 
          fetcherFn={(offset, limit) => fetchMarketItems(offset, limit)} 
          swrKey='fetchMarketItems' />
    </Box>    
    </>
  ) 
}
