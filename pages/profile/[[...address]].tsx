import { useEffect, useState } from 'react'
import { fetchNftsInWallet, fetchNFTsListedOnMarket, isValidAddress } from '../../lib/nft.js'
import { useContext } from 'react'
import { WalletContext } from '../_app'
import { Box, Stack, Tab, Tabs} from '@mui/material'
import { useRouter } from 'next/router'
import { InfiniteScroll } from '../../components/InfiniteScroll'
import { HodlImpactAlert } from '../../components/HodlImpactAlert'
import { HodlButton } from '../../components/HodlButton'
import Link from 'next/link'


const Profile = () => {
  const [walletNfts, setWalletNfts] = useState([]);
  const [marketNfts, setMarketNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { address } = useContext(WalletContext);
  const [value, setValue] = useState(0);
  const [validAddress, setValidAddress] = useState(true);
  const [numberOfNfts, setNumberOfNfts] = useState();

  useEffect(() => {
    const load = async () => {
      const valid = await isValidAddress(router.query.address[0]);
      setValidAddress(valid);

      if (!valid) {
        return;
      }

      // const walletNfts = await fetchNftsInWallet(router.query.address[0]);
      const marketNfts = await fetchNFTsListedOnMarket(router.query.address[0]);

      //setWalletNfts(walletNfts);
      setMarketNfts(marketNfts);      
    };

    if (router.query.address) {
      // setLoading(true);
      load();
      // setLoading(false);
    }

  }, [router.query.address]);

  // If the user connects their wallet on the profile page, redirect them to the actual location
  useEffect(() => {
    if (address) {
      router.push(`/profile/${address}`);
    }
  }, [address])
  

  if (!address && !router.query.address) {
    return <HodlImpactAlert title="Connect Wallet" message={"You'll need to connect your wallet to go to the Moon"} />
  }

  if (!validAddress) {
    return <HodlImpactAlert title="Invalid Address" message={"The profile address doesn't appear to be valid"} />
  }
 
  if (Number(numberOfNfts) === 0) {
    console.log("address === router?.query?.address",address, router?.query?.address)
    return <HodlImpactAlert 
    title="Empty" 
    message={"This profile does not have any NFTs"} 
    action={
      Boolean(router?.query?.address && address === router?.query?.address[0]) && 
      <Link href="/mint" passHref>
        <HodlButton>Mint One</HodlButton>
      </Link>
    }/>
  }
  return (
    <>
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
          { router?.query?.address && router?.query?.address[0] && 
            <InfiniteScroll 
              fetcherFn={async (offset, limit) => {
                console.log('here')
                const [data, next, length] = await fetchNftsInWallet(router.query.address[0], offset, limit);
                setNumberOfNfts(length);
                return [data, next, length]
              }} 
              swrKey={'walletNfts'}
              viewSale={false}/>
            }
        </Stack>
      </div>
      <div hidden={value !== 1}>
        <Stack spacing={4} >
          {/* <InfiniteScroll 
            fetcherFn={(offset, limit) => {
              const data = marketNfts.filter(nft => nft).slice(offset, offset + limit)
              return [data, offset + data.length, data.length]
            }} 
            swrKey={'marketNfts'}
            /> */}
        </Stack>
      </div>
    </Box>
    </>
  )
}

export default Profile;
