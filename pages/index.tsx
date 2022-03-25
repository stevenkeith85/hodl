/* pages/index.js */
import { fetchMarketItems } from '../lib/market'
import { Box } from '@mui/material'
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
