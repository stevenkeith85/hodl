import { useEffect, useState } from 'react'
import { isValidAddress } from '../../lib/profile'
import { useContext } from 'react'
import { WalletContext } from '../_app'
import { Badge, Box, CircularProgress, Tab, Tabs} from '@mui/material'
import { useRouter } from 'next/router'

import { HodlImpactAlert } from '../../components/HodlImpactAlert'
import { HodlButton } from '../../components/HodlButton'

import { ProfileAvatar } from '../../components'
import { useFollow } from '../../hooks/useFollow'

import dynamic from 'next/dynamic'
import useSWR from 'swr'
import { ProfileAvatarStatic } from '../../components/ProfileAvatarStatic'
import { getShortAddress } from '../../lib/utils'

const HodlingTab = dynamic(
   // @ts-ignore
  () => import('../../components/profile/HodlingTab').then((module) => module.HodlingTab),
  {loading: () => <CircularProgress />}
);

const ListedTab = dynamic(
   // @ts-ignore
  () => import('../../components/profile/ListedTab').then((module) => module.ListedTab),
  {loading: () => <CircularProgress />}
);

const FollowingTab = dynamic(
   // @ts-ignore
  () => import('../../components/profile/FollowingTab').then((module) => module.FollowingTab),
  {loading: () => <CircularProgress />}
);

const FollowersTab = dynamic(
   // @ts-ignore
  () => import('../../components/profile/FollowersTab').then((module) => module.FollowersTab),
  {loading: () => <CircularProgress />}
);


export async function getServerSideProps({ params }) {
  let profileAddress = params.address;
  let nickname = null;

  const isValid = await isValidAddress(params.address);
  
  if (isValid) {
    // TODO: Is this address a 'user'. i.e. has logged in before
    // If not, we should return a 404 as we do not want to generate a page for every valid ethereum address (bad for SEO)

    // If this address has a nickname set, we'd prefer to use that
    const r = await fetch(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/nickname?address=${params.address}`);
    const { nickname } = await r.json();

    if (nickname !== null) {
      return {
        redirect: {
          destination: `/profile/${nickname}`
        }
      }
    }
  }
  else {
    const r = await fetch(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/address?nickname=${params.address}`);
    const { address } = await r.json();

    if (address === null) {
      return {
        notFound: true
      }
    }

    profileAddress = address;
    nickname = params.address;
  }

  const prefetchedFollowing = await fetch(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/following?address=${profileAddress}`)
                                    .then(r => r.json())
                                    .then(json => json.following)

  const prefetchedFollowers = await fetch(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/followers?address=${profileAddress}`)
                                    .then(r => r.json())
                                    .then(json => json.followers)

  return {
    props: {
      profileAddress,
      nickname,
      prefetchedFollowing,
      prefetchedFollowers
    },
  }
}


const Profile = ({ profileAddress, nickname, prefetchedFollowing, prefetchedFollowers}) => {
  const router = useRouter();
  const { address } = useContext(WalletContext);
  const [value, setValue] = useState(0);  
  const [numberHodling, setNumberHodling] = useState();
  const [numberListed, setNumberListed] = useState();

  const [follow, isFollowing] = useFollow(profileAddress);
  

  const {data: followers, mutate:updateFollowers} = useSWR([`/api/followers`, profileAddress], 
                                                            (url, address) => fetch(`${url}?address=${address}`)
                                                                              .then(r => r.json())
                                                                              .then(json => json.followers),
                                                            { fallbackData: prefetchedFollowers}
                                                            );

  
  const {data: following} = useSWR([`/api/following`, profileAddress], 
                                    (url, address) => fetch(`${url}?address=${address}`)
                                                        .then(r => r.json())
                                                        .then(json => json.following),
                                    { fallbackData: prefetchedFollowing}
                                  )

  useEffect(() => {
    setValue(0)// redirect to first tab on route change
  }, [router.asPath]);


  useEffect(() => {
    if (router.query.tab) {
      setValue(Number(router.query.tab)); // we want to send the user to the tab of interest. i.e. if they mint something they go to hodling. if they list something they go to listed
    }
  }, [router.query.tab]);


  if (!address && !profileAddress) {
    return <HodlImpactAlert title="Connect Wallet" message={"You need to connect your wallet to view your profile"} />
  }

  return (
    <>
   {
     
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", paddingTop: 2, paddingBottom: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, marginBottom: 2, alignItems: 'center'}}>
        <ProfileAvatarStatic size="large" handle={nickname || getShortAddress(profileAddress) } />
        {Boolean( address !== profileAddress) &&
        <HodlButton 
        sx={{
          paddingTop: 1,
          paddingBottom: 1,
          paddingLeft: 2,
          paddingRight: 2
        }}
        
        onClick={
          async () => {
            updateFollowers(isFollowing ? 
                followers.filter(f => f !== address) : 
                [...followers, address], { revalidate: false});
                
            await follow();     
          }
        }>
          { isFollowing ? 'Unfollow' : 'Follow' }
        </HodlButton>
      }
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Tabs
            value={value}
            onChange={(e, v) => {
              setValue(v);
              router.push({
                pathname: '/profile/[address]',
                query: { address: nickname || profileAddress, tab: v},
              },
              undefined,
              {shallow: true})
            }}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab value={0} label="Hodling" icon={ <Badge sx={{p: '6px 3px'}} showZero badgeContent={numberHodling}></Badge> } iconPosition="end"/>
            <Tab value={1} label="Listed" icon={ <Badge sx={{p: '6px 3px'}} showZero badgeContent={numberListed}></Badge> } iconPosition="end"/>
            <Tab value={2} label="Following" icon={ <Badge sx={{p: '6px 3px'}} showZero badgeContent={following?.length}></Badge> } iconPosition="end"/>
            <Tab value={3} label="Followers" icon={ <Badge sx={{p: '6px 3px'}} showZero badgeContent={followers?.length} ></Badge> } iconPosition="end"/>
          </Tabs>
      </Box>
      <div hidden={value !== 0}>
        {/* @ts-ignore */}
        <HodlingTab setNumberHodling={setNumberHodling} profileAddress={profileAddress}/>
      </div>
      <div hidden={value !== 1}>
        {/* @ts-ignore */}
        <ListedTab setNumberListed={setNumberListed} profileAddress={profileAddress}/>
      </div>
      <div hidden={value !== 2}>
        {/* @ts-ignore */}
        <FollowingTab address={address} following={following} profileAddress={profileAddress}/>
      </div>
      <div hidden={value !== 3}>
        {/* @ts-ignore */}
        <FollowersTab address={address} followers={followers} profileAddress={profileAddress}/>
      </div>
    </Box>
}
    </>
  )
}

export default Profile;
