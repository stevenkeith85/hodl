import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import { authenticate } from '../../lib/jwt';

import { getFollowersCount } from '../api/followers/count'
import { getFollowing } from '../api/following'
import { getFollowers } from '../api/followers'
import { useFollowing } from '../../hooks/useFollowing';
import { useFollowers } from '../../hooks/useFollowers';
import { useListed } from '../../hooks/useListed';
import { useHodling } from '../../hooks/useHodling';

import { getFollowingCount } from '../api/following/count'
import { useFollowingCount } from '../../hooks/useFollowingCount'
import { useFollowersCount } from '../../hooks/useFollowersCount'
import { FollowersContext } from '../../contexts/FollowersContext'
import { FollowingContext } from '../../contexts/FollowingContext'
import { getUser } from '../api/user/[handle]'
import { useHodlingCount } from '../../hooks/useHodlingCount'
import { useListedCount } from '../../hooks/useListedCount'

import Box from '@mui/material/Box'


const InfiniteScrollNftWindows = dynamic(
  () => import('../../components/InfiniteScrollNftWindows').then((module) => module.InfiniteScrollNftWindows),
  {
    ssr: false,
    loading: () => null
  }
);

const UserLinksList = dynamic(
  () => import('../../components/profile/UserLinksList').then((module) => module.UserLinksList),
  {
    ssr: false,
    loading: () => null
  }
);

const ProfileHeader = dynamic(
  () => import('../../components/profile/ProfileHeader').then((module) => module.ProfileHeader),
  {
    ssr: false,
    loading: () => null
  }
);

const ProfileTabs = dynamic(
  () => import('../../components/profile/ProfileTabs').then((module) => module.ProfileTabs),
  {
    ssr: false,
    loading: () => null
  }
);

export async function getServerSideProps({ params, query, req, res }) {
  await authenticate(req, res);

  const owner = await getUser(params.handle, req?.address);

  if (!owner) {
    return {
      notFound: true
    }
  }

  const tab = Number(query.tab) || 0;
  const limit = 9;

  const prefetchedFollowingCountPromise = getFollowingCount(owner.address);
  const prefetchedFollowersCountPromise = getFollowersCount(owner.address);

  const prefetchedFollowingPromise = getFollowing(owner.address, 0, limit);
  const prefetchedFollowersPromise = getFollowers(owner.address, 0, limit);

  const [
    prefetchedFollowingCount,
    prefetchedFollowersCount,
    prefetchedFollowing,
    prefetchedFollowers,
  ] = await Promise.all([
    prefetchedFollowingCountPromise,
    prefetchedFollowersCountPromise,
    prefetchedFollowingPromise,
    prefetchedFollowersPromise,
  ])

  return {
    props: {
      owner,
      address: req.address || null,
      prefetchedFollowingCount,
      prefetchedFollowing: [prefetchedFollowing],
      prefetchedFollowersCount,
      prefetchedFollowers: [prefetchedFollowers],
      tab,
      limit
    },
  }
}

// TODO: getting the hodling count and list can both trigger cache updates. we'd like to prevent the double update
const Profile = ({
  owner,
  address,
  prefetchedFollowingCount = null,
  prefetchedFollowing = null,
  prefetchedFollowersCount = null,
  prefetchedFollowers = null,
  tab,
  limit
}) => {
  const router = useRouter();

  const [value, setValue] = useState(Number(tab)); // tab

  const [hodlingCount] = useHodlingCount(owner.address);
  const { swr: hodling } = useHodling(owner.address, limit, null, value == 0);

  const [listedCount] = useListedCount(owner.address);
  const { swr: listed } = useListed(owner.address, limit, null, value == 1);

  const [followingCount] = useFollowingCount(owner.address, prefetchedFollowingCount);
  const { swr: following } = useFollowing(true, owner.address, limit, prefetchedFollowing);

  const [followersCount] = useFollowersCount(owner.address, prefetchedFollowersCount);
  const { swr: followers } = useFollowers(true, owner.address, limit, prefetchedFollowers);

  useEffect(() => {
    if (!router?.query?.tab) {
      setValue(0)// redirect to first tab on route change. TODO - is this still needed?
    }
  }, [router.asPath, router?.query?.tab]);


  return <>
    <Head>
      <link href={`/profile/${owner.nickname || owner.address}`} />
    </Head>
    <FollowersContext.Provider value={{ followers }}>
      <FollowingContext.Provider value={{ following }}>
        <Head>
          <title>{owner.nickname || owner.address} · Hodl My Moon</title>
        </Head>
        <Box sx={{
          height: {
            md:'120px',
          },
          marginTop: { xs: 2, sm: 4 }
        }}>
          <ProfileHeader owner={owner} />
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '49.5px',
          marginTop: {
            xs: 2,
            sm: 4,
          },
          marginBottom: {
            xs: 2,
            sm: 4
          }
        }}>
          <ProfileTabs
            owner={owner}
            followersCount={followersCount}
            followingCount={followingCount}
            hodlingCount={hodlingCount}
            listedCount={listedCount}
            value={value}
            setValue={setValue}
          />
        </Box>

        <Box sx={{ marginBottom: 4 }}>
          <div hidden={value !== 0}>
            <InfiniteScrollNftWindows swr={hodling} limit={limit} pattern={false} />
          </div>
          <div hidden={value !== 1}>
            <InfiniteScrollNftWindows swr={listed} limit={limit} pattern={false} />
          </div>
          <Box
            hidden={value !== 2}
            width={
              {
                xs: '100%',
                md: '50%',
              }
            }
          >
            <UserLinksList swr={following} limit={limit} />
          </Box>
          <Box
            hidden={value !== 3}
            width={
              {
                xs: '100%',
                md: '50%'
              }
            }
          >
            <UserLinksList swr={followers} limit={limit} />
          </Box>
        </Box>
      </FollowingContext.Provider>
    </FollowersContext.Provider>
  </>;
}

export default Profile;
