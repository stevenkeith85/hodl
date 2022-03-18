/* pages/index.js */
import { fetchMarketItems } from '../lib/nft.js'
import { Alert, Box, Stack, Typography } from '@mui/material'
import { DiamondTitle } from '../components/DiamondTitle'
import { InfiniteScroll } from '../components/InfiniteScroll'
import { useEffect, useState } from 'react'
import { HodlButton } from '../components/HodlButton'
import { HodlImpactAlert } from '../components/HodlImpactAlert'
import Link from 'next/link';

export default function Home() {

  const [ethereum, setEthereum] = useState(null)
  useEffect(() => {
    setEthereum(window.ethereum);
  },[])

  if (!ethereum) {
    return (
      <HodlImpactAlert 
        title="Preparing for lift off"
        message="To use this site, you need a web3 mobile app or browser extension."
        action={
          <Link href="https://metamask.io/download/" passHref>
              <HodlButton>Get MetaMask</HodlButton>
            </Link>
        }
        />      
      )
  }

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
