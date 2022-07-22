import { useEffect, useState } from 'react'
import { isValidAddress } from '../../lib/profile'
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

import { getFollowersCount } from '../api/followers/count'
import { getHodling } from '../api/profile/hodling'
import { getListed } from '../api/profile/listed'
import { getFollowing } from '../api/following'
import { getFollowers } from '../api/followers'
import { useFollowing } from '../../hooks/useFollowing';
import { useFollowers } from '../../hooks/useFollowers';
import { useListed } from '../../hooks/useListed';
import { useHodling } from '../../hooks/useHodling';
import humanize from "humanize-plus";
import { HodlImpactAlert } from '../../components/HodlImpactAlert';
import { authenticate } from '../../lib/jwt';
import { getFollowingCount } from '../api/following/count'
import { useFollowingCount } from '../../hooks/useFollowingCount'
import { AvatarLinksList } from '../../components/profile/AvatarLinksList'
import { useFollowersCount } from '../../hooks/useFollowersCount'
import { NftLinksList } from '../../components/profile/NftLinksList'
import { FollowersContext } from '../../contexts/FollowersContext'
import { FollowingContext } from '../../contexts/FollowingContext'


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

  const limit = 10;
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

  const [value, setValue] = useState(Number(tab)); // tab

  const [hodlingCount, hodling] = useHodling(profileAddress, limit, prefetchedHodlingCount, prefetchedHodling);
  const [listedCount, listed] = useListed(profileAddress, limit, prefetchedListedCount, prefetchedListed);

  const [followingCount] = useFollowingCount(profileAddress, prefetchedFollowingCount);
  const { swr: following } = useFollowing(true, profileAddress, limit);

  const [followersCount] = useFollowersCount(profileAddress, prefetchedFollowersCount);
  const { swr: followers } = useFollowers(true, profileAddress, limit);

  useEffect(() => {
    if (!router?.query?.tab) {
      setValue(0)// redirect to first tab on route change
    }
  }, [router.asPath, router?.query?.tab]);


  return (
    <FollowersContext.Provider value={{ followers }}>
      <FollowingContext.Provider value={{ following }}>
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

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 4,
        marginBottom: 4
      }}>
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
        <NftLinksList swr={hodling} limit={limit} />
      </div>
      <div hidden={value !== 1}>
        <NftLinksList swr={listed} limit={limit} />
      </div>
      <div hidden={value !== 2}>
        <AvatarLinksList swr={following} limit={limit} />
      </div>
      <div hidden={value !== 3}>
        <AvatarLinksList swr={followers} limit={limit} />
      </div>
      </FollowingContext.Provider>
    </FollowersContext.Provider>
  )
}

export default Profile;
