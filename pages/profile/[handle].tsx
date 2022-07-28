import { useEffect, useState } from 'react'
import { Badge, Box, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { HodlLoadingSpinner } from '../../components/HodlLoadingSpinner'
import { FollowButton } from '../../components/profile/FollowButton'
import Head from 'next/head'
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
import { authenticate } from '../../lib/jwt';
import { getFollowingCount } from '../api/following/count'
import { useFollowingCount } from '../../hooks/useFollowingCount'
import { useFollowersCount } from '../../hooks/useFollowersCount'
import { FollowersContext } from '../../contexts/FollowersContext'
import { FollowingContext } from '../../contexts/FollowingContext'
import { getUser } from '../api/user/[handle]'
import { UserAvatarAndHandle } from '../../components/avatar/UserAvatarAndHandle'



const NftLinksList = dynamic(
  // @ts-ignore
  () => import('../../components/profile/NftLinksList').then((module) => module.NftLinksList),
  { loading: () => <HodlLoadingSpinner /> }
);

const UserLinksList = dynamic(
  // @ts-ignore
  () => import('../../components/profile/UserLinksList').then((module) => module.UserLinksList),
  { loading: () => <HodlLoadingSpinner /> }
);



export async function getServerSideProps({ params, query, req, res }) {
  await authenticate(req, res);

  const owner = await getUser(params.handle);
  
  if (!owner) {
      return {
        notFound: true
      }
  }
  
  const tab = Number(query.tab) || 0;
  const limit = 10;  
  
  const prefetchedHodlingCount = await getHodlingCount(owner.address);
  const prefetchedHodling = tab == 0 ? await getHodling(owner.address, 0, limit) : null;

  const prefetchedListedCount = await getListedCount(owner.address);
  const prefetchedListed = tab == 1 ? await getListed(owner.address, 0, limit) : null;

  const prefetchedFollowingCount = await getFollowingCount(owner.address);
  const prefetchedFollowing = tab == 2 ? await getFollowing(owner.address) : null;

  const prefetchedFollowersCount = await getFollowersCount(owner.address);
  const prefetchedFollowers = tab == 3 ? await getFollowers(owner.address) : null;

  return {
    props: {
      owner,
      address: req.address || null,
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
  owner,
  address,
  prefetchedFollowingCount = null,
  prefetchedFollowing = null,
  prefetchedFollowersCount = null,
  prefetchedFollowers = null,
  prefetchedHodlingCount = null,
  prefetchedHodling = null,
  prefetchedListedCount = null,
  prefetchedListed = null,
  tab,
  limit
}) => {
  const router = useRouter();

  const [value, setValue] = useState(Number(tab)); // tab

  const [hodlingCount, hodling] = useHodling(owner.address, limit, prefetchedHodlingCount, prefetchedHodling);
  const [listedCount, listed] = useListed(owner.address, limit, prefetchedListedCount, prefetchedListed);

  const [followingCount] = useFollowingCount(owner.address, prefetchedFollowingCount);
  const { swr: following } = useFollowing(true, owner.address, limit);

  const [followersCount] = useFollowersCount(owner.address, prefetchedFollowersCount);
  const { swr: followers } = useFollowers(true, owner.address, limit);

  useEffect(() => {
    if (!router?.query?.tab) {
      setValue(0)// redirect to first tab on route change
    }
  }, [router.asPath, router?.query?.tab]);


  return (<>
    <Head>
      <link href={`/profile/${owner.nickname || owner.address}`} />
    </Head>
    <FollowersContext.Provider value={{ followers }}>
      <FollowingContext.Provider value={{ following }}>
      <Head>
        <title>{owner.nickname || owner.address} | NFT Market | HodlMyMoon</title>
      </Head>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 4
        }}>
        <UserAvatarAndHandle user={owner} size={'120px'} fontSize={'24px'}/>
        <FollowButton profileAddress={owner.address} />
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
                pathname: '/profile/[handle]',
                query: {
                  handle: owner.nickname || owner.address,
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
        <UserLinksList swr={following} limit={limit} />
      </div>
      <div hidden={value !== 3}>
        <UserLinksList swr={followers} limit={limit} />
      </div>
      </FollowingContext.Provider>
    </FollowersContext.Provider>
    </>)
}

export default Profile;
