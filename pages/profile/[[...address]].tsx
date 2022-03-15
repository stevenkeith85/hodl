import { useEffect, useState } from 'react'
import { fetchNftsInWallet, fetchNFTsListedOnMarket } from '../../lib/nft.js'
import { useContext } from 'react'
import { WalletContext } from '../_app'
import { Box, CircularProgress, Stack } from '@mui/material'
import { ConnectWallet } from '../../components/ConnectWallet'
import InformationBox from '../../components/InformationBox'
import { DiamondTitle } from '../../components/DiamondTitle'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { InfiniteSlide } from '../../components/InfiniteSlide'


const Profile = () => {
  const [walletNfts, setWalletNfts] = useState([]);
  const [marketNfts, setMarketNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { address } = useContext(WalletContext);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const walletNfts = await fetchNftsInWallet(router.query.address[0]);
      const marketNfts = await fetchNFTsListedOnMarket(router.query.address[0]);

      setWalletNfts(walletNfts);
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

  if (!walletNfts.length && !marketNfts.length) {
    return <InformationBox message="No assets owned" />
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
      <Stack spacing={4}>
        <Box>
          <DiamondTitle title="Hodling" />
          <InfiniteSlide 
            fetcherFn={(offset, limit) => {
              const data = walletNfts.filter(nft => nft).slice(offset, offset + limit)
              return [data, offset + data.length, data.length]
            }} 
            nftsPerPage={4} 
            swrKey={'walletNfts'}
            viewSale={false}/>
        </Box>
        <Box>
        <DiamondTitle title="Listed" />
        <InfiniteSlide 
          fetcherFn={(offset, limit) => {
            const data = marketNfts.filter(nft => nft).slice(offset, offset + limit)
            return [data, offset + data.length, data.length]
          }} 
          nftsPerPage={4} 
          swrKey={'marketNfts'}
          />
        </Box>
      </Stack>
    </Box>
    </>
  )
}

export default Profile;
