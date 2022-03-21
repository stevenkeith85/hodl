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
import { ProfileAvatar } from '../../components'


const Profile = () => {
  const router = useRouter();
  const { address } = useContext(WalletContext);
  const [value, setValue] = useState(0);  
  const [numberHodling, setNumberHodling] = useState();
  const [numberListed, setNumberListed] = useState();


  // If the user connects their wallet on the profile page, redirect them to the actual location
  useEffect(() => {
    if (address) {
      router.push(`/profile/${address}`);
    }
  }, [address])
  

  if (!address && !router.query.address) {
    return <HodlImpactAlert title="Connect Wallet" message={"You need to connect your wallet to view your profile"} />
  }
 
  if (Number(numberHodling) === 0 && Number(numberListed) == 0) {
    return (
    <HodlImpactAlert 
      title="Empty" 
      message={"This profile does not have any NFTs"} 
      action={
        Boolean(router?.query?.address && address === router?.query?.address[0]) && 
        <Link href="/mint" passHref>
          <HodlButton>Mint One</HodlButton>
        </Link>
      }
    />)
  }

  return (
    <>
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", paddingTop: 2, paddingBottom: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          
          <Tabs
            value={value}
            onChange={(e, v) => { console.log(e, v); setValue(v) }}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab value={0} label="Hodling" />
            <Tab value={1} label="Listed" />
          </Tabs>
          <ProfileAvatar address={router?.query?.address?.length && router?.query?.address[0] || address } />
      </Box>
      <div hidden={value !== 0}>
        <Stack spacing={4}>
          { router?.query?.address && router?.query?.address[0] && 
            <InfiniteScroll 
              fetcherFn={async (offset, limit) => {
                const [data, next, length] = await fetchNftsInWallet(router.query.address[0], offset, limit);
                setNumberHodling(length);
                if(Number(length) === 0) {
                  setValue(1) // set tab to listed if we aren't holding any. if we have nothing listed then we'll show a message (above)
                }
                return [data, next, length]
              }} 
              swrKey={'walletNfts'}
              viewSale={false}/>
            }
        </Stack>
      </div>
      <div hidden={value !== 1}>
        <Stack spacing={4} >
          <InfiniteScroll 
            fetcherFn={async (offset, limit) => {
              const data = (await fetchNFTsListedOnMarket(router.query.address[0])).slice(offset, offset + limit).filter(nft => nft)
              setNumberListed(data.length);
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
