/* pages/index.js */
import { fetchMarketItems } from '../lib/nft.js'
import { Box } from '@mui/material'
import { DiamondTitle } from '../components/DiamondTitle'
import { InfiniteScroll } from '../components/InfiniteScroll'

export default function Home() {

  return (
    <>
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", paddingTop: 4, paddingBottom: 4 }}>
      <DiamondTitle title="Market" />
      <InfiniteScroll 
          fetcherFn={(offset, limit) => fetchMarketItems(offset, limit)} 
          swrKey='fetchMarketItems' />
    </Box>    
    </>
  ) 
}
