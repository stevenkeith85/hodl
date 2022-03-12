import { useEffect, useState } from 'react'
import { fetchNftsInWallet, fetchNFTsListedOnMarket } from '../../lib/nft.js'
import { useContext } from 'react'
import { WalletContext } from '../_app'
import { Box, CircularProgress, Stack } from '@mui/material'
import NftList from '../../components/NftList'
import { ConnectWallet } from '../../components/ConnectWallet'
import InformationBox from '../../components/InformationBox'
import { DiamondTitle } from '../../components/DiamondTitle'
import { useRouter } from 'next/router'


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
      console.log('walletNfts', walletNfts)
      const marketNfts = await fetchNFTsListedOnMarket(router.query.address[0]);
      console.log('marketNfts', marketNfts)

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
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", paddingTop: 4, paddingBottom: 4 }}>
      <Stack spacing={4}>
        {Boolean(walletNfts.length) &&
          <Box>
            <DiamondTitle title="Hodling" />
            <NftList nfts={walletNfts} showTop={false} />
          </Box>
        }
        {Boolean(marketNfts.length) && (
          <Box>
            <DiamondTitle title="Listed" />
            <NftList nfts={marketNfts} />
          </Box>)
        }
      </Stack>
    </Box>
  )
}

export default Profile;
