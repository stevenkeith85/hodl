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
import { getUserUsingHandle } from '../api/user/[handle]'
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

  const owner = await getUserUsingHandle(params.handle, req?.address);

  if (!owner) {
    return {
      notFound: true
    }
  }

  const tab = Number(query.tab) || 0;
  const limit = 9;

  const prefetchedFollowingCountPromise = getFollowingCount(owner.address);
  const prefetchedFollowersCountPromise = getFollowersCount(owner.address);

  const prefetchedFollowingPromise = getFollowing(owner.address, 0, limit, req?.address);
  const prefetchedFollowersPromise = getFollowers(owner.address, 0, limit, req?.address);

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
      owner: owner,
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

  // return <>{JSON.stringify(prefetchedFollowing, null, 2)}</>
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


  const title = `NFT creator on Hodl My Moon - ${`${owner?.nickname || owner?.address}git `}`;
  const description = `View the Polygon NFTs of ${`${owner.nickname || owner.address}`} on hodlmymoon.com`;
  const canonical = `${`https://www.hodlmymoon.com/profile/${owner.nickname || owner.address}`}`;
  const shareImage = `https://res.cloudinary.com/dyobirj7r/image/upload/ar_216:253,c_fill,w_1080/prod/nfts/${owner.avatar ? owner.avatar.image : 'bafkreihuew5ij6lvc2k7vjqr65hit7fljl7fsxlikrkndcdyp47xbi6pvy'}`;

  return <>
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hodlmymoon" />
      <meta name="twitter:creator" content="@hodlmymoon" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={shareImage} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={shareImage} />
      <meta property="og:description" content={description} />
    </Head>

    <FollowersContext.Provider value={{ followers }}>
      <FollowingContext.Provider value={{ following }}>
        <Box sx={{
          height: {
            md: '120px',
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
