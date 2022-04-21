import { useEffect, useState } from 'react'
import { isValidAddress } from '../../lib/profile'
import { useContext } from 'react'
import { WalletContext } from '../_app'
import { Badge, Box, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'
import { HodlImpactAlert } from '../../components/HodlImpactAlert'
import { HodlButton } from '../../components/HodlButton'
import { useFollow } from '../../hooks/useFollow'
import dynamic from 'next/dynamic'
import useSWR from 'swr'
import { makeAddressBasedFetcher } from '../../lib/utils'
import { HodlLoadingSpinner } from '../../components/HodlLoadingSpinner'
import { ProfileAvatar } from '../../components/ProfileAvatar'
import Head from 'next/head'
import { getNickname } from '../api/profile/nickname'
import { getAddress } from '../api/profile/address'
import { getHodlingCount } from '../api/profile/hodlingCount'
import { getListedCount } from '../api/profile/listedCount'
import { getFollowingCount } from '../api/follow/followingCount'
import { getFollowersCount } from '../api/follow/followersCount'
import { getHodling } from '../api/profile/hodling'
import { getListed } from '../api/profile/listed'
import { getFollowing } from '../api/follow/following'
import { getFollowers } from '../api/follow/followers'

const HodlingTab = dynamic(
  // @ts-ignore
  () => import('../../components/profile/HodlingTab').then((module) => module.HodlingTab),
  { loading: () => <HodlLoadingSpinner /> }
);

const ListedTab = dynamic(
  // @ts-ignore
  () => import('../../components/profile/ListedTab').then((module) => module.ListedTab),
  { loading: () => <HodlLoadingSpinner /> }
);

const FollowingTab = dynamic(
  // @ts-ignore
  () => import('../../components/profile/FollowingTab').then((module) => module.FollowingTab),
  { loading: () => <HodlLoadingSpinner /> }
);

const FollowersTab = dynamic(
  // @ts-ignore
  () => import('../../components/profile/FollowersTab').then((module) => module.FollowersTab),
  { loading: () => <HodlLoadingSpinner /> }
);


export async function getServerSideProps({ params, query }) {
  let profileAddress = params.address;
  let nickname = null;

  const limit = 10;
  const tab = Number(query.tab) || 0;

  const isValid = await isValidAddress(params.address);

  if (isValid) {
    const nickname = await getNickname(params.address);

    if (nickname !== null) {
      return {
        redirect: {
          destination: `/profile/${nickname}`
        }
      }
    }
  }
  else {
    const address = await getAddress(params.address);

    if (address === null) {
      return {
        notFound: true
      }
    }

    profileAddress = address;
    nickname = params.address;
  }

  // Hodling
  const prefetchedHodlingCount = await getHodlingCount(profileAddress);
  const prefetchedHodling = tab == 0 ? await getHodling(profileAddress, 0, limit) : null;

  // Listed
  const prefetchedListedCount = await getListedCount(profileAddress);
  const prefetchedListed = tab == 1 ? await getListed(profileAddress, 0, limit) : null;

  // Following                                    
  const prefetchedFollowingCount = await getFollowingCount(profileAddress);
  const prefetchedFollowing = tab == 2 ? await getFollowing(profileAddress): null;

  // Followers
  const prefetchedFollowersCount = await getFollowersCount(profileAddress);
  const prefetchedFollowers = tab == 3 ? await getFollowers(profileAddress): null;


  return {
    props: {
      profileAddress,
      nickname,
      prefetchedFollowingCount: prefetchedFollowingCount ? prefetchedFollowingCount : 0,
      prefetchedFollowing: prefetchedFollowing ? prefetchedFollowing : [],
      prefetchedFollowersCount: prefetchedFollowersCount ? prefetchedFollowersCount : 0,
      prefetchedFollowers: prefetchedFollowers ? prefetchedFollowers : [],
      prefetchedHodlingCount: prefetchedHodlingCount ? prefetchedHodlingCount : 0,
      prefetchedHodling: prefetchedHodling ? [prefetchedHodling] : [],
      prefetchedListedCount: prefetchedListedCount ? prefetchedListedCount : 0,
      prefetchedListed: prefetchedListed ? [prefetchedListed] : [],
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
  const { data: hodlingCount } = useSWR([`/api/profile/hodlingCount`, profileAddress],
    makeAddressBasedFetcher('count'),
    { fallbackData: prefetchedHodlingCount, revalidateOnMount: false }
  )

  // Listed
  const { data: listedCount } = useSWR([`/api/profile/listedCount`, profileAddress],
    makeAddressBasedFetcher('count'),
    { fallbackData: prefetchedListedCount, revalidateOnMount: false }
  )
  // Followers
  const { data: followersCount, mutate: updateFollowersCount } = useSWR([`/api/follow/followersCount`, profileAddress],
    makeAddressBasedFetcher('count'),
    { fallbackData: prefetchedFollowersCount, revalidateOnMount: false }
  )

  const { data: followers, mutate: updateFollowers } = useSWR([`/api/follow/followers`, profileAddress],
    makeAddressBasedFetcher('followers'),
    { fallbackData: prefetchedFollowers }
  );

  // Following                                                            
  const { data: followingCount } = useSWR([`/api/follow/followingCount`, profileAddress],
    makeAddressBasedFetcher('count'),
    { fallbackData: prefetchedFollowingCount, revalidateOnMount: false }
  )

  const { data: following } = useSWR([`/api/follow/following`, profileAddress],
    makeAddressBasedFetcher('following'),
    { fallbackData: prefetchedFollowing }
  )
  useEffect(() => {
    if (!router?.query?.tab) {
      setValue(0)// redirect to first tab on route change
    }
  }, [router.asPath, router?.query?.tab]);

  return (
    <>
      <Head>
        <title>{nickname || profileAddress}</title>
      </Head>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
        <ProfileAvatar size="large" profileAddress={profileAddress} />
        {Boolean(address) && Boolean(address !== profileAddress) &&
          <HodlButton
            sx={{
              paddingTop: 1,
              paddingBottom: 1,
              paddingLeft: 2,
              paddingRight: 2
            }}

            onClick={
              async () => {
                updateFollowers(isFollowing ? followers.filter(f => f !== address) : [...followers, address], { revalidate: false });
                updateFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1, { revalidate: false })
                // @ts-ignore
                await follow();
              }
            }
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </HodlButton>
        }
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Tabs
          value={value}
          onChange={(e, v) => {
            setValue(v);
            router.push({
              pathname: '/profile/[address]',
              query: { address: nickname || profileAddress, tab: v },
            },
              undefined,
              { shallow: true })
          }}
          textColor="secondary"
          indicatorColor="secondary"
          sx={{
            marginY: 2,
            '.MuiTab-root': {
              minHeight: 'auto',
            }
          }}
        >
          <Tab value={0} label="Hodling" icon={<Badge sx={{ p: '6px 3px' }} showZero badgeContent={hodlingCount}></Badge>} iconPosition="end" />
          <Tab value={1} label="Listed" icon={<Badge sx={{ p: '6px 3px' }} showZero badgeContent={listedCount}></Badge>} iconPosition="end" />
          <Tab value={2} label="Following" icon={<Badge sx={{ p: '6px 3px' }} showZero badgeContent={followingCount}></Badge>} iconPosition="end" />
          <Tab value={3} label="Followers" icon={<Badge sx={{ p: '6px 3px' }} showZero badgeContent={followersCount} ></Badge>} iconPosition="end" />
        </Tabs>
      </Box>
      <div hidden={value !== 0}>
        <HodlingTab profileAddress={profileAddress} prefetchedData={prefetchedHodling} />
      </div>
      <div hidden={value !== 1}>
        <ListedTab prefetchedData={prefetchedListed} profileAddress={profileAddress} />
      </div>
      <div hidden={value !== 2}>
        <FollowingTab address={address} following={following} profileAddress={profileAddress} />
      </div>
      <div hidden={value !== 3}>
        <FollowersTab address={address} followers={followers} profileAddress={profileAddress} />
      </div>
    </>
  )
}

export default Profile;
