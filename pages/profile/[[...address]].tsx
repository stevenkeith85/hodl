import { useEffect, useState } from 'react'
import { fetchNftsInWallet, fetchNFTsListedOnMarket } from '../../lib/nft.js'
import { useContext } from 'react'
import { WalletContext } from '../_app'
import { Box, CircularProgress, Stack, Tab, Tabs} from '@mui/material'
import { ConnectWallet } from '../../components/ConnectWallet'
import InformationBox from '../../components/InformationBox'
import { DiamondTitle } from '../../components/DiamondTitle'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { InfiniteScroll } from '../../components/InfiniteScroll'


const Profile = () => {
  const [walletNfts, setWalletNfts] = useState([]);
  const [marketNfts, setMarketNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { address } = useContext(WalletContext);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // const walletNfts = await fetchNftsInWallet(router.query.address[0]);
      const marketNfts = await fetchNFTsListedOnMarket(router.query.address[0]);

      //setWalletNfts(walletNfts);
      setMarketNfts(marketNfts);

      setLoading(false);
    };

    if (router.query.address) {
      load();
    }

  }, [router.query.address]);

  // If the user connects their wallet on the profile page, redirect them to the actual location
  useEffect(() => {
    if (address && !router.query.address) {
      router.push(`/profile/${address}`);
    }
  }, [address])

  if (loading) {
    return (
      <Box sx={{ marginTop: "40vh", display: 'flex', justifyContent: "center", alignItems: "center", alignContent: "center" }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!router.query.address) {
    return <ConnectWallet />;
  }

  return (
    <>
    <Head>
      {walletNfts.map(nft => {
        if (!nft) {return null;}
        const link = `https://res.cloudinary.com/dyobirj7r/f_auto,c_limit,w_550,q_75/nfts/${nft.image}`;

        return (<link key={link} rel="preload" as="image" href={link}/>)
      })
    }
    </Head>
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", paddingTop: 4, paddingBottom: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse'}}>
          <Tabs
            value={value}
            onChange={(e, v) => { console.log(e, v); setValue(v) }}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
            
          >
            <Tab value={0} label="Hodling" />
            <Tab value={1} label="Listed" />
          </Tabs>
      </Box>
      
      
      <div hidden={value !== 0}>
        <Stack spacing={4}>
            <InfiniteScroll 
              fetcherFn={async (offset, limit) => {
                const [data, next, length] = await fetchNftsInWallet(router.query.address[0], offset, limit);
                return [data, next, length]
              }} 
              swrKey={'walletNfts'}
              viewSale={false}/>
        </Stack>
      </div>
      <div hidden={value !== 1}>
        <Stack spacing={4} >
          <InfiniteScroll 
            fetcherFn={(offset, limit) => {
              const data = marketNfts.filter(nft => nft).slice(offset, offset + limit)
              return [data, offset + data.length, data.length]
            }} 
            swrKey={'marketNfts'}
            />
        </Stack>
      </div>
    </Box>
    </>
  )
}

export default Profile;
