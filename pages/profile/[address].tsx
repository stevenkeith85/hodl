import { useEffect, useState } from 'react'
import { isValidAddress } from '../../lib/profile'
import { useContext } from 'react'
import { WalletContext } from '../_app'
import { Badge, Box, CircularProgress, Tab, Tabs} from '@mui/material'
import { useRouter } from 'next/router'

import { HodlImpactAlert } from '../../components/HodlImpactAlert'
import { HodlButton } from '../../components/HodlButton'

import { useFollow } from '../../hooks/useFollow'

import dynamic from 'next/dynamic'
import useSWR, { mutate } from 'swr'
import { ProfileAvatarStatic } from '../../components/ProfileAvatarStatic'
import { getShortAddress, makeAddressBasedFetcher } from '../../lib/utils'
import { HodlLoadingSpinner } from '../../components/HodlLoadingSpinner'

const HodlingTab = dynamic(
   // @ts-ignore
  () => import('../../components/profile/HodlingTab').then((module) => module.HodlingTab),
  {loading: () => <HodlLoadingSpinner />}
);

const ListedTab = dynamic(
   // @ts-ignore
  () => import('../../components/profile/ListedTab').then((module) => module.ListedTab),
  {loading: () => <HodlLoadingSpinner />}
);

const FollowingTab = dynamic(
   // @ts-ignore
  () => import('../../components/profile/FollowingTab').then((module) => module.FollowingTab),
  {loading: () => <HodlLoadingSpinner />}
);

const FollowersTab = dynamic(
   // @ts-ignore
  () => import('../../components/profile/FollowersTab').then((module) => module.FollowersTab),
  {loading: () => <HodlLoadingSpinner />}
);


export async function getServerSideProps({ params, query }) {
  let profileAddress = params.address;
  let nickname = null;
  const tab = Number(query.tab) || 0;

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

  // Hodling
  const prefetchedHodlingCount = await fetch(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/profile/hodlingCount?address=${profileAddress}`)
                                        .then(r => r.json())
                                        .then(json => json.count)

  const prefetchedHodling = tab == 0 ? await fetch(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/profile/hodling?address=${profileAddress}&offset=0&limit=20`)
                                                    .then(r => r.json())
                                                    .then(json => json.data) : 
                                                    null;

  // Listed
  const prefetchedListedCount = await fetch(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/profile/listedCount?address=${profileAddress}`)
                                        .then(r => r.json())
                                        .then(json => json.count)

  const prefetchedListed = tab == 1 ? await fetch(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/profile/listed?address=${profileAddress}&offset=0&limit=20`)
                                    .then(r => r.json())
                                    .then(json => json.data) :
                                    null;


  // Following                                    
  const prefetchedFollowingCount = await fetch(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/follow/followingCount?address=${profileAddress}`)
                                  .then(r => r.json())
                                  .then(json => json.count)

  const prefetchedFollowing = tab == 2 ? await fetch(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/follow/following?address=${profileAddress}`)
                                    .then(r => r.json())
                                    .then(json => json.following) : 
                                    null;

  // Followers
  const prefetchedFollowersCount = await fetch(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/follow/followersCount?address=${profileAddress}`)
                                          .then(r => r.json())
                                          .then(json => json.count)

  const prefetchedFollowers = tab == 3 ? await fetch(`${process.env.NEXT_PUBLIC_HODL_API_ADDRESS}/follow/followers?address=${profileAddress}`)
                                                .then(r => r.json())
                                                .then(json => json.followers) :
                                                null;


  return {
    props: {
      profileAddress,
      nickname,
      prefetchedFollowingCount,
      prefetchedFollowing,
      prefetchedFollowersCount,
      prefetchedFollowers,
      prefetchedHodlingCount,
      prefetchedHodling: prefetchedHodling ? [prefetchedHodling] : [],
      prefetchedListedCount,
      prefetchedListed: prefetchedListed ? [prefetchedListed]: [],
      tab
    },
  }
}


const Profile = ({ 
  profileAddress, 
  nickname, 
  prefetchedFollowingCount, 
  prefetchedFollowing, 
  prefetchedFollowersCount,
  prefetchedFollowers, 
  prefetchedHodlingCount, 
  prefetchedHodling, 
  prefetchedListedCount,
  prefetchedListed, 
  tab
}) => {
  const router = useRouter();
  const { address } = useContext(WalletContext);
  const [value, setValue] = useState(Number(tab));  

  const [follow, isFollowing] = useFollow(profileAddress);
  

  // Hodling
  const {data: hodlingCount} = useSWR([`/api/profile/hodlingCount`, profileAddress], 
                                    makeAddressBasedFetcher('count'),
                                    { fallbackData: prefetchedHodlingCount}
                                  )  

  // Listed
  const {data: listedCount} = useSWR([`/api/profile/listedCount`, profileAddress], 
                                        makeAddressBasedFetcher('count'),
                                        { fallbackData: prefetchedListedCount}
)  
  // Followers
  const {data: followersCount, mutate:updateFollowersCount} = useSWR([`/api/follow/followersCount`, profileAddress], 
                                    makeAddressBasedFetcher('count'),
                                    { fallbackData: prefetchedFollowersCount}
                                  )  

  const {data: followers, mutate:updateFollowers} = useSWR([`/api/follow/followers`, profileAddress], 
                                                            makeAddressBasedFetcher('followers'),
                                                            { fallbackData: prefetchedFollowers}
                                                            );

  // Following                                                            
  const {data: followingCount} = useSWR([`/api/follow/followingCount`, profileAddress], 
                                    makeAddressBasedFetcher('count'),
                                    { fallbackData: prefetchedFollowingCount}
                                  )  

  const {data: following} = useSWR([`/api/follow/following`, profileAddress], 
                                    makeAddressBasedFetcher('following'),
                                    { fallbackData: prefetchedFollowing}
                                  )
  useEffect(() => {
    if (!router?.query?.tab) {
      setValue(0)// redirect to first tab on route change
    }
  }, [router.asPath]);

  if (!address && !profileAddress) {
    return <HodlImpactAlert title="Connect Wallet" message={"You need to connect your wallet to view your profile"} />
  }

  return (
    <>
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', paddingY: 2, justifyContent: 'space-between', alignItems: 'center'}}>
        <ProfileAvatarStatic size="large" handle={nickname || getShortAddress(profileAddress) } />
        {Boolean(address) && Boolean( address !== profileAddress) &&
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
              updateFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1, { revalidate: false})
              // @ts-ignore
              await follow();     
            }
          }
        >
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
            sx={{ 
              '.MuiTab-root': { 
                minHeight: '50px',
              }
            }}
          >
            <Tab value={0} label="Hodling" icon={ <Badge sx={{p: '6px 3px'}} showZero badgeContent={hodlingCount}></Badge> } iconPosition="end"/>
            <Tab value={1} label="Listed" icon={ <Badge sx={{p: '6px 3px'}} showZero badgeContent={listedCount}></Badge> } iconPosition="end"/>
            <Tab value={2} label="Following" icon={ <Badge sx={{p: '6px 3px'}} showZero badgeContent={followingCount}></Badge> } iconPosition="end"/>
            <Tab value={3} label="Followers" icon={ <Badge sx={{p: '6px 3px'}} showZero badgeContent={followersCount} ></Badge> } iconPosition="end"/> */}
          </Tabs>
      </Box>
      <div hidden={value !== 0}>
        <HodlingTab profileAddress={profileAddress} prefetchedData={prefetchedHodling}/>
      </div>
      <div hidden={value !== 1}>
        <ListedTab prefetchedData={prefetchedListed} profileAddress={profileAddress} />
      </div>
      <div hidden={value !== 2}>
        <FollowingTab address={address} following={following} profileAddress={profileAddress}/>
      </div>
      <div hidden={value !== 3}>
        <FollowersTab address={address} followers={followers} profileAddress={profileAddress}/>
      </div>
    </Box>
    </>
  )
}

export default Profile;
