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
import { useHodlingCount } from '../../hooks/useHodlingCount'
import { useListedCount } from '../../hooks/useListedCount'
import Link from 'next/link'
import { ProfileNameOrAddress } from '../../components/avatar/ProfileNameOrAddress'
import { InfiniteScrollNftWindows } from '../../components/InfiniteScrollNftWindows'
import { CopyAddress } from '../../components/CopyAddress'


const UserLinksList = dynamic(
  // @ts-ignore
  () => import('../../components/profile/UserLinksList').then((module) => module.UserLinksList),
  { loading: () => <HodlLoadingSpinner /> }
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
  const limit = 10;

  // TODO - We could run these in parallel
  const prefetchedHodlingCount = await getHodlingCount(owner.address);
  const prefetchedListedCount = await getListedCount(owner.address);
  const prefetchedFollowingCount = await getFollowingCount(owner.address);
  const prefetchedFollowersCount = await getFollowersCount(owner.address);

  const prefetchedHodling = tab == 0 ? [await getHodling(owner.address, 0, limit)] : null;
  const prefetchedListed = tab == 1 ? [await getListed(owner.address, 0, limit)] : null;
  const prefetchedFollowing = tab == 2 ? [await getFollowing(owner.address, 0, limit)] : null;
  const prefetchedFollowers = tab == 3 ? [await getFollowers(owner.address, 0, limit)] : null;

  return {
    props: {
      owner,
      address: req.address || null,
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

  const [hodlingCount] = useHodlingCount(owner.address, prefetchedHodlingCount);
  const { swr: hodling } = useHodling(owner.address, limit, prefetchedHodling);

  const [listedCount] = useListedCount(owner.address, prefetchedListedCount);
  const { swr: listed } = useListed(owner.address, limit, prefetchedListed);

  const [followingCount] = useFollowingCount(owner.address, prefetchedFollowingCount);
  const { swr: following } = useFollowing(true, owner.address, limit, prefetchedFollowing);

  const [followersCount] = useFollowersCount(owner.address, prefetchedFollowersCount);
  const { swr: followers } = useFollowers(true, owner.address, limit, prefetchedFollowers);

  useEffect(() => {
    if (!router?.query?.tab) {
      setValue(0)// redirect to first tab on route change. TODO - is this still needed?
    }
  }, [router.asPath, router?.query?.tab]);


  return (<>
    <Head>
      <link href={`/profile/${owner.nickname || owner.address}`} />
    </Head>
    <FollowersContext.Provider value={{ followers }}>
      <FollowingContext.Provider value={{ following }}>
        <Head>
          <title>{owner.nickname || owner.address} · Hodl My Moon</title>
        </Head>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 4
          }}>
          <Box
            display="flex"
            gap={4}
            alignItems={"center"}
          >
            <UserAvatarAndHandle
              address={owner.address}
              fallbackData={owner}
              size={120}
              fontSize={'24px'}
              handle={false}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5
              }}>
              <ProfileNameOrAddress profileAddress={owner.address} fallbackData={owner} fontSize="26px" sx={{ fontWeight: 700 }} />
              <CopyAddress owner={owner}/>
            </Box>
          </Box>
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
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Link href={`/profile/${owner.nickname || owner.address}`} passHref>
              <Tab
                component="a"
                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                  setValue(0);
                }}
                key={0}
                value={0}
                label="Hodling"
                icon={<Badge
                  sx={{ p: '6px 3px' }}
                  showZero
                  max={Number.MAX_SAFE_INTEGER}
                  badgeContent={humanize.compactInteger(hodlingCount, 1)}
                >
                </Badge>
                }
                iconPosition="end"
              />
            </Link>
            {/* Listed */}
            <Link href={`/profile/${owner.nickname || owner.address}?tab=1`} passHref>
              <Tab
                component="a"
                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                  setValue(1);
                }}
                key={1}
                value={1}
                label="Listed"
                icon={<Badge
                  sx={{ p: '6px 3px' }}
                  showZero
                  max={Number.MAX_SAFE_INTEGER}
                  badgeContent={humanize.compactInteger(listedCount, 1)}
                >
                </Badge>
                }
                iconPosition="end"
              />
            </Link>
            <Link href={`/profile/${owner.nickname || owner.address}?tab=2`} passHref>
              <Tab
                component="a"
                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                  setValue(2);
                }}
                key={2}
                value={2}
                label="Following"
                icon={<Badge
                  sx={{ p: '6px 3px' }}
                  showZero
                  max={Number.MAX_SAFE_INTEGER}
                  badgeContent={humanize.compactInteger(followingCount, 1)}
                >
                </Badge>}
                iconPosition="end"
              />
            </Link>
            <Link href={`/profile/${owner.nickname || owner.address}?tab=3`} passHref>
              <Tab
                component="a"
                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                  setValue(3);
                }}
                key={3}
                value={3}
                label="Followers"
                icon={<Badge
                  sx={{ p: '6px 3px' }}
                  showZero
                  max={Number.MAX_SAFE_INTEGER}
                  badgeContent={humanize.compactInteger(followersCount, 1)}
                >
                </Badge>}
                iconPosition="end"
              />
            </Link>
          </Tabs>
        </Box>
        <Box sx={{ marginBottom: 3 }}>
          <div hidden={value !== 0}>
            <InfiniteScrollNftWindows swr={hodling} limit={limit} />
          </div>
          <div hidden={value !== 1}>
            <InfiniteScrollNftWindows swr={listed} limit={limit} />
          </div>
          <Box
            hidden={value !== 2}
            width={'max-content'}
          >
            <UserLinksList swr={following} limit={limit} />
          </Box>
          <Box
            hidden={value !== 3}
            width={'max-content'}
          >
            <UserLinksList swr={followers} limit={limit} />
          </Box>
        </Box>
      </FollowingContext.Provider>
    </FollowersContext.Provider>
  </>)
}

export default Profile;
