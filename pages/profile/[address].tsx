import { useEffect, useState } from 'react'
import { fetchNftsInWallet, fetchNFTsListedOnMarket, isValidAddress } from '../../lib/profile'
import { useContext } from 'react'
import { WalletContext } from '../_app'
import { Box, Stack, Tab, Tabs, Typography} from '@mui/material'
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

  const [following, setFollowing] = useState([]);
  const [validAddress, setValidAddress] = useState(false);
  const [userIsFollowingThisProfile, setUserIsFollowingThisProfile] = useState(null);
  
  useEffect(async () => {
    const isValid = await isValidAddress(router.query.address);
    setValidAddress(isValid);

    if (router.query.address && !isValid) {
      console.log('here')
      const response = await fetch(`/api/address?nickname=${router.query.address}`);
      const result = await response.json();
      router.query.address = result.address;
      setValidAddress(true);
    }
    // Who this profile is following
    if (router.query.address) {
      const response = await fetch(`/api/following?address=${router.query.address}`);
      const result = await response.json();
      setFollowing(result.following);
    }

    // Who the user is following
    if (address && router.query.address) {
      const response = await fetch(`/api/following?address=${address}`);
      const result = await response.json();
      
      if (result.following.indexOf(router.query.address) !== -1) {
        setUserIsFollowingThisProfile(true);
      } else {
        setUserIsFollowingThisProfile(false);
      }
    }
  }, [address, router.query.address]);
  
  useEffect(() => {
    setValue(0)// redirect to first tab on route change
  }, [router.asPath]);

  if (!address && !router.query.address) {
    return <HodlImpactAlert title="Connect Wallet" message={"You need to connect your wallet to view your profile"} />
  }
 
  if (Number(numberHodling) === 0 && Number(numberListed) == 0) {
    return (
    <HodlImpactAlert 
      title="Empty" 
      message={"This profile does not have any NFTs"} 
      action={
        Boolean(router?.query?.address && address === router?.query?.address) && 
        <Link href="/mint" passHref>
          <HodlButton>Mint One</HodlButton>
        </Link>
      }
    />)
  }

  

  return (
    <>
   {validAddress && router?.query?.address &&
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", paddingTop: 2, paddingBottom: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, marginBottom: 2}}>
        <ProfileAvatar size="large" profileAddress={router?.query?.address || address } />
        {Boolean( address !== router.query.address) &&
        <HodlButton onClick={async () => {
          if (!address) { return }
           const response = await fetch('/api/follow', {
              method: 'POST',
              headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              }),
              body: JSON.stringify({ 
                address: address,
                addressToFollow: router?.query?.address?.length && router?.query?.address
              })
            });

            setUserIsFollowingThisProfile(old => !old);
        }}>
          { userIsFollowingThisProfile ? 'Unfollow' : 'Follow' }
          </HodlButton>
      }
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Tabs
            value={value}
            onChange={(e, v) => setValue(v)}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab value={0} label="Hodling" />
            <Tab value={1} label="Listed" />
            <Tab value={2} label="Following" />
          </Tabs>
      </Box>
      <div hidden={value !== 0}>
        <Stack spacing={4}>
            <InfiniteScroll 
              fetcherFn={async (offset, limit) => {
                const [data, next, length] = await fetchNftsInWallet(router.query.address, offset, limit);
                setNumberHodling(length);

                if (Number(length) === 0) {
                  setValue(1) // set tab to listed if we aren't holding any. if we have nothing listed then we'll show a message (above)
                }

                return [data, next, length]
              }} 
              swrKey={'walletNfts: ' + router.query.address}
              showTop={false}/>
        </Stack>
      </div>
      <div hidden={value !== 1}>
        <Stack spacing={4} >
        {  
          <InfiniteScroll 
            fetcherFn={async (offset, limit) => {
              const [data, next, length] = await fetchNFTsListedOnMarket(router.query.address, offset, limit);
              setNumberListed(data.length);
              return [data, next, length]
            }} 
            swrKey={'marketNfts: ' + router.query.address}
            />
          }
        </Stack>
      </div>
      <div hidden={value !== 2}>
        <Stack spacing={4} sx={{ padding: 4, paddingLeft: 0}}>
          { following.length ? 
              following.map(address => 
                <ProfileAvatar color="primary" profileAddress={address}/>  
              ) 
              :
              <Typography>{ 
                address && 
                router.query?.address?.length && 
                address === router.query.address ? 
                `You aren't following anyone`:
                `This user isn't following anyone`
              }</Typography>
            }
        </Stack>
      </div>
    </Box>
}
    </>
  )
}

export default Profile;
