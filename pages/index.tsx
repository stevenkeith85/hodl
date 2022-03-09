/* pages/index.js */
import { useEffect, useState } from 'react'
import { fetchMarketItems } from '../lib/nft.js'
import { Box, CircularProgress } from '@mui/material'
import NftList from '../components/NftList'
import InformationBox from '../components/InformationBox'


export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const load = async () => {
      const items = await fetchMarketItems();
      console.log(items)
      setNfts(items)
      setLoading(false);
    };
    
    load();
    
  }, []);

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
    <>
    { Boolean(!loading) && <NftList nfts={nfts} viewSale={true} /> }
    </>
  ) 
}
