import { useEffect, useState } from 'react'
import { isValidAddress } from '../../lib/profile'
import { useContext } from 'react'
import { WalletContext } from '../../contexts/WalletContext';
import { Badge, Box, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { HodlLoadingSpinner } from '../../components/HodlLoadingSpinner'
import { ProfileAvatar } from '../../components/avatar/ProfileAvatar'
import { FollowButton } from '../../components/profile/FollowButton'
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
import { useFollowing } from '../../hooks/useFollowing';
import { useFollowers } from '../../hooks/useFollowers';
import { useListed } from '../../hooks/useListed';
import { useHodling } from '../../hooks/useHodling';
import humanize from "humanize-plus";
import { HodlImpactAlert } from '../../components/HodlImpactAlert';
import { authenticate } from '../../lib/jwt';

const InfiniteScrollTab = dynamic(
  // @ts-ignore
  () => import('../../components/profile/InfiniteScrollTab').then((module) => module.InfiniteScrollTab),
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


export async function getServerSideProps({ params, query, req, res }) {

  await authenticate(req, res);
  
  let profileAddress = params.address; // TODO: Rename this param as it can be an address OR a nickname
  let nickname = null;

  const limit = 4;
  const tab = Number(query.tab) || 0;

  const isValid = await isValidAddress(params.address);

  if (isValid) { // params.address is a wallet address her
    const nickname = await getNickname(params.address);

    if (nickname !== null) {
      return {
        redirect: {
          destination: tab ? `/profile/${nickname}?tab=${tab}` : `/profile/${nickname}`
        }
      }
    }
  }
  else {
    const address = await getAddress(params.address); // params.address is a nickname here

    if (address === null) {
      return {
        notFound: true
      }
    }

    profileAddress = address;
    nickname = params.address;
  }

  const prefetchedHodlingCount = await getHodlingCount(profileAddress);
  const prefetchedHodling = tab == 0 ? await getHodling(profileAddress, 0, limit) : null;

  const prefetchedListedCount = await getListedCount(profileAddress);
  const prefetchedListed = tab == 1 ? await getListed(profileAddress, 0, limit) : null;

  const prefetchedFollowingCount = await getFollowingCount(profileAddress);
  const prefetchedFollowing = tab == 2 ? await getFollowing(profileAddress) : null;

  const prefetchedFollowersCount = await getFollowersCount(profileAddress);
  const prefetchedFollowers = tab == 3 ? await getFollowers(profileAddress) : null;

  return {
    props: {
      address: req.address || null,
      profileAddress,
      nickname,
      prefetchedFollowingCount,
      prefetchedFollowing,
      prefetchedFollowersCount,
      prefetchedFollowers,
      prefetchedHodlingCount,
      prefetchedHodling: prefetchedHodling ? [prefetchedHodling] : null,
      prefetchedListedCount,
      prefetchedListed: prefetchedListed ? [prefetchedListed] : null,
      tab,
      limit
    },
  }
}

const Profile = ({
  address,
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
  tab,
  limit
}) => {
  const router = useRouter();
  // const { address } = useContext(WalletContext);
  const [value, setValue] = useState(Number(tab));

  const [hodlingCount, hodlingSWR] = useHodling(profileAddress, limit, prefetchedHodlingCount, prefetchedHodling);
  const [listedCount, listedSWR] = useListed(profileAddress, limit, prefetchedListedCount, prefetchedListed);
  const [followersCount, followers] = useFollowers(profileAddress, prefetchedFollowersCount, prefetchedFollowers);
  const [followingCount, following] = useFollowing(profileAddress, prefetchedFollowingCount, prefetchedFollowing);

  console.log('listedCount', listedCount)
  useEffect(() => {
    if (!router?.query?.tab) {
      setValue(0)// redirect to first tab on route change
    }
  }, [router.asPath, router?.query?.tab]);


  return (
    <>
      <Head>
        <title>{nickname || profileAddress} | NFT Market | HodlMyMoon</title>
      </Head>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: 4 
        }}>
        <ProfileAvatar size="xlarge" profileAddress={profileAddress} />
        <FollowButton profileAddress={profileAddress} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, marginBottom: 4 }}>
        <Tabs
          value={value}
          onChange={(e, v) => {
            setValue(v);

            router.push(
              {
                pathname: '/profile/[address]',
                query: {
                  address: nickname || profileAddress,
                  tab: v
                }
              },
              undefined,
              {
                shallow: true
              }
            )
          }}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab
            key={0}
            value={0}
            label="Hodling"
            icon={<Badge sx={{ p: '6px 3px' }} showZero badgeContent={!isNaN(hodlingCount) && humanize.compactInteger(hodlingCount, 1)}></Badge>}
            iconPosition="end"
          />
          <Tab
            key={1}
            value={1}
            label="Listed"
            icon={<Badge sx={{ p: '6px 3px' }} showZero badgeContent={!isNaN(listedCount) && humanize.compactInteger(listedCount, 1)}></Badge>}
            iconPosition="end"
          />
          <Tab
            key={2}
            value={2}
            label="Following"
            icon={<Badge sx={{ p: '6px 3px' }} showZero badgeContent={!isNaN(followingCount) && humanize.compactInteger(followingCount, 1)}></Badge>}
            iconPosition="end"
          />
          <Tab
            key={3}
            value={3}
            label="Followers"
            icon={<Badge sx={{ p: '6px 3px' }} showZero badgeContent={!isNaN(followersCount) && humanize.compactInteger(followersCount, 1)}></Badge>}
            iconPosition="end"
          />
        </Tabs>
      </Box>
      <div hidden={value !== 0}>
        <InfiniteScrollTab swr={hodlingSWR} limit={limit} showAvatar={false} showName={true} />
      </div>
      <div hidden={value !== 1}>
        <InfiniteScrollTab swr={listedSWR} limit={limit} showAvatar={false} showName={true} />
        { listedSWR?.data && listedSWR?.data[0]?.items?.length === 0 &&
          <HodlImpactAlert title="Nothing Listed" message="This user does not have any NFTs for sale" sx={{ padding: 0 }}/>}
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
