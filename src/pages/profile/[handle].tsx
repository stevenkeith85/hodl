import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import { authenticate } from '../../lib/jwt';

import { getFollowersCount } from '../api/followers/count'
import { getFollowingCount } from '../api/following/count'
import { getFollowing } from '../api/following'
import { getFollowers } from '../api/followers'
import { getHodling } from '../api/contracts/token/hodling';
import { getUserUsingHandle } from '../api/user/[handle]';

import { useFollowingCount } from '../../hooks/useFollowingCount'
import { useFollowersCount } from '../../hooks/useFollowersCount'
import { useHodlingCount } from '../../hooks/useHodlingCount';
import { useListedCount } from '../../hooks/useListedCount';

import Box from '@mui/material/Box'
import { getHodlingCount } from '../api/contracts/token/hodling/count';
import { getListedCount } from '../api/contracts/market/listed/count';
import { getListed } from '../api/contracts/market/listed';

const ProfileHeader = dynamic(
  () => import('../../components/profile/ProfileHeader').then((module) => module.ProfileHeader),
  {
    ssr: true,
    loading: () => null
  }
);

const ProfileTabs = dynamic(
  () => import('../../components/profile/ProfileTabs').then((module) => module.ProfileTabs),
  {
    ssr: true,
    loading: () => null
  }
);

const HodlingList = dynamic(
  () => import('../../components/profile/HodlingList').then((module) => module.HodlingList),
  {
    ssr: true,
    loading: () => null
  }
);

const ListedList = dynamic(
  () => import('../../components/profile/ListedList').then((module) => module.ListedList),
  {
    ssr: true,
    loading: () => null
  }
);

const FollowersList = dynamic(
  () => import('../../components/profile/FollowersList').then((module) => module.FollowersList),
  {
    ssr: true,
    loading: () => null
  }
);

const FollowingList = dynamic(
  () => import('../../components/profile/FollowingList').then((module) => module.FollowingList),
  {
    ssr: true,
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

  const prefetchedHodlingCountPromise = getHodlingCount(owner.address);
  const prefetchedListedCountPromise = getListedCount(owner.address);
  const prefetchedFollowingCountPromise = getFollowingCount(owner.address);
  const prefetchedFollowersCountPromise = getFollowersCount(owner.address);

  // we only need to prefetch these if we are on that specific tab
  const prefetchedHodlingPromise = tab == 0 ? getHodling(owner.address, 0, limit, req) : null;
  const prefetchedListedPromise = tab == 1 ? getListed(owner.address, 0, limit, req) : null;
  const prefetchedFollowingPromise = tab == 2 ? getFollowing(owner.address, 0, limit, req?.address) : null;
  const prefetchedFollowersPromise = tab == 3 ? getFollowers(owner.address, 0, limit, req?.address) : null;

  const [
    prefetchedHodlingCount,
    prefetchedHodling,
    prefetchedListedCount,
    prefetchedListed,
    prefetchedFollowingCount,
    prefetchedFollowersCount,
    prefetchedFollowing,
    prefetchedFollowers,
  ] = await Promise.all([
    prefetchedHodlingCountPromise,
    prefetchedHodlingPromise,
    prefetchedListedCountPromise,
    prefetchedListedPromise,
    prefetchedFollowingCountPromise,
    prefetchedFollowersCountPromise,
    prefetchedFollowingPromise,
    prefetchedFollowersPromise,
  ])

  return {
    props: {
      owner: owner,
      address: req.address || null,
      prefetchedHodlingCount,
      prefetchedHodling: prefetchedHodling ? [prefetchedHodling] : null,
      prefetchedListedCount,
      prefetchedListed: prefetchedListed ? [prefetchedListed] : null,
      prefetchedFollowingCount,
      prefetchedFollowing: prefetchedFollowing ? [prefetchedFollowing] : null,
      prefetchedFollowersCount,
      prefetchedFollowers: prefetchedFollowers ? [prefetchedFollowers] : null,
      tab,
      limit
    },
  }
}

const Profile = ({
  owner,
  address,
  prefetchedHodlingCount = null,
  prefetchedHodling,
  prefetchedListedCount = null,
  prefetchedListed,
  prefetchedFollowingCount = null,
  prefetchedFollowing = null,
  prefetchedFollowersCount = null,
  prefetchedFollowers = null,
  tab,
  limit
}) => {
  const router = useRouter();
  const [value, setValue] = useState(Number(tab)); // tab

  const [hodlingCount] = useHodlingCount(owner.address, prefetchedHodlingCount);
  const [listedCount] = useListedCount(owner.address, prefetchedListedCount);
  const [followingCount] = useFollowingCount(owner.address, prefetchedFollowingCount);
  const [followersCount] = useFollowersCount(owner.address, prefetchedFollowersCount);

  useEffect(() => {
    if (!router?.query?.tab) {
      setValue(0)// redirect to first tab on route change. TODO - is this still needed?
    }
  }, [router.asPath, router?.query?.tab]);


  const title = `NFT creator on Hodl My Moon - ${owner?.nickname || owner?.address}`;
  const description = `View the Polygon NFTs of ${owner.nickname || owner.address} on hodlmymoon.com`;
  const canonical = `https://www.hodlmymoon.com/profile/${owner.nickname || owner.address}`;
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

    <Box sx={{
      height: {
        md: '120px',
      },
      marginTop: { xs: 3, sm: 5 }
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
        {value == 0 && <HodlingList address={owner.address} limit={limit} prefetchedHodling={prefetchedHodling} />}
      </div>
      <div hidden={value !== 1}>
        {value == 1 && <ListedList address={owner.address} limit={limit} prefetchedListed={prefetchedListed} />}
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
        {value === 2 && <FollowingList address={owner.address} limit={limit} prefetchedFollowing={prefetchedFollowing} />}
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
        {value === 3 && <FollowersList address={owner.address} limit={limit} prefetchedFollowers={prefetchedFollowers} />}
      </Box>
    </Box>
  </>;
}

export default Profile;
