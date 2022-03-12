/* pages/index.js */
import { useEffect, useState } from 'react'
import { fetchMarketItems } from '../lib/nft.js'
import { Box, CircularProgress, Button, Stack, Typography } from '@mui/material'
import NftList from '../components/NftList'
import InformationBox from '../components/InformationBox'
import { DiamondTitle } from '../components/DiamondTitle'


export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [next, setNext] = useState(0);
  const [prev, setPrev] = useState(0);

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(4);
  
  const load = async () => {
    setLoading(true);

    const [items, nextOffset, total] = await fetchMarketItems(offset, limit);
    setNfts(items);

    
    if (BigInt(nextOffset) !== BigInt(total)) {
      setNext(nextOffset);
    }
    

    if (offset - limit >= 0) {
      setPrev(offset - limit);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [offset]);

  if (loading) {
    return (
      <Box sx={{ marginTop: "40vh", display: 'flex', justifyContent: "center", alignItems: "center", alignContent: "center"}}>
        <CircularProgress color="secondary" />
      </Box>
    );  
  } 
  
  if (!nfts.length) {
    return <InformationBox message = "No items in marketplace" />
  }

  return (
    <Stack spacing={2} sx={{ paddingTop: 4, paddingBottom: 2 }}>
      <Typography variant='h1' >
        <DiamondTitle title="The Market" />
      </Typography>
    { Boolean(!loading) && <NftList nfts={nfts} viewSale={true} /> }
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Button variant="outlined" color="secondary" sx={{ width: 100 }} onClick={() => setOffset(prev)}>Prev</Button>  
        <Button variant="outlined" sx={{ width: 100 }} onClick={() => setOffset(next)}>Next</Button>
      </Stack>
    </Stack>
  ) 
}
