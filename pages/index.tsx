/* pages/index.js */
import { fetchMarketItems } from '../lib/nft.js'
import { Box } from '@mui/material'
import { DiamondTitle } from '../components/DiamondTitle'
import { InfiniteSlide } from '../components/InfiniteSlide'

export default function Home() {
  return (
    <>
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", paddingTop: 4, paddingBottom: 4 }}>
      <DiamondTitle title="Market" />
      <InfiniteSlide 
          fetcherFn={(offset, limit) => fetchMarketItems(offset, limit)} 
          nftsPerPage={8}
          swrKey='fetchMarketItems' />
      
    </Box>    
    </>
  ) 
}
