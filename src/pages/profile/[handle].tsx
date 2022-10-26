import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { HodlLoadingSpinner } from '../../components/HodlLoadingSpinner'
import { FollowButton } from '../../components/profile/FollowButton'
import Head from 'next/head'

import { getFollowersCount } from '../api/followers/count'
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
import { CopyText } from '../../components/CopyText'
import { getShortAddress } from '../../lib/utils'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Skeleton from '@mui/material/Skeleton'
import Badge from '@mui/material/Badge'


const UserLinksList = dynamic(

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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: { xs: 2, sm: 4 }
          }}>
          <Box
            display="flex"
            alignItems={"center"}
          >
            <Box sx={{
              display: {
                xs: 'block',
                sm: 'none'
              }
            }}>
              <UserAvatarAndHandle
                address={owner.address}
                fallbackData={owner}
                size={90}
                fontSize={20}
                handle={false}
              />
            </Box>
            <Box sx={{
              display: {
                xs: 'none',
                sm: 'block'
              }
            }}>
              <UserAvatarAndHandle
                address={owner.address}
                fallbackData={owner}
                size={120}
                fontSize={24}
                handle={false}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                margin: {
                  xs: 2,
                  sm: 3
                }
              }}>
              <ProfileNameOrAddress
                profileAddress={owner.address}
                fallbackData={owner}
                sx={{
                  fontSize: {
                    xs: 20,
                    sm: 24
                  }
                }}
              />
              <CopyText text={owner.address}>
                <Typography
                  sx={{
                    fontSize: {
                      xs: 14,
                      sm: 14
                    },
                    color: theme => theme.palette.text.secondary
                  }}>
                  {getShortAddress(owner.address)}
                </Typography>
              </CopyText>
            </Box>
          </Box>
          <FollowButton profileAddress={owner.address} variant="outlined" />
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: {
            xs: 2,
            sm: 4,
          },
          marginBottom: {
            xs: 2,
            sm: 4
          }
        }}>
          <Tabs
            value={value}
            textColor="secondary"
            indicatorColor="secondary"
            sx={{
              width: '100%'
            }}
          >
            <Link
              href={`/profile/${owner.nickname || owner.address}`}
              passHref
              legacyBehavior>
              <Tab
                component="a"
                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                  setValue(0);
                }}
                key={0}
                value={0}
                label="Hodling"
                icon={<Badge
                  sx={{
                    p: {
                      xs: '6px 1px',
                      sm: '6px 3px',
                    }
                  }}
                  showZero
                  max={Number.MAX_SAFE_INTEGER}
                  badgeContent={
                    hodlingCount === null ?
                      <Skeleton width={10} variant="text" animation="wave" /> :
                      humanize.compactInteger(hodlingCount, 1)
                  }
                >
                </Badge>
                }
                iconPosition="end"
                sx={{
                  minWidth: 0,
                  width: {
                    xs: '25%',
                    sm: '120px',
                  },
                  paddingX: {
                    xs: 1.75,
                    sm: 2
                  },
                  paddingY: 2,
                  margin: 0
                }}
              />
            </Link>
            {/* Listed */}
            <Link
              href={`/profile/${owner.nickname || owner.address}?tab=1`}
              passHref
              legacyBehavior>
              <Tab
                component="a"
                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                  setValue(1);
                }}
                key={1}
                value={1}
                label="Listed"
                icon={<Badge
                  sx={{
                    p: {
                      xs: '6px 1px',
                      sm: '6px 3px',
                    }
                  }}
                  showZero
                  max={Number.MAX_SAFE_INTEGER}
                  badgeContent={
                    listedCount === null ?
                      <Skeleton width={10} variant="text" animation="wave" /> :
                      humanize.compactInteger(listedCount, 1)
                  }
                >
                </Badge>
                }
                iconPosition="end"
                sx={{
                  minWidth: 0,
                  width: {
                    xs: '25%',
                    sm: '120px',
                  },
                  paddingX: {
                    xs: 1.75,
                    sm: 2
                  },
                  paddingY: 2,
                  margin: 0
                }}
              />
            </Link>
            <Link
              href={`/profile/${owner.nickname || owner.address}?tab=2`}
              passHref
              legacyBehavior>
              <Tab
                component="a"
                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                  setValue(2);
                }}
                key={2}
                value={2}
                label="Following"
                icon={<Badge
                  sx={{
                    p: {
                      xs: '6px 1px',
                      sm: '6px 3px',
                    }
                  }}
                  showZero
                  max={Number.MAX_SAFE_INTEGER}
                  badgeContent={humanize.compactInteger(followingCount, 1)}
                >
                </Badge>}
                iconPosition="end"
                sx={{
                  minWidth: 0,
                  width: {
                    xs: '25%',
                    sm: '120px',
                  },
                  paddingX: {
                    xs: 1.75,
                    sm: 2
                  },
                  paddingY: 2,
                  margin: 0
                }}
              />
            </Link>
            <Link
              href={`/profile/${owner.nickname || owner.address}?tab=3`}
              passHref
              legacyBehavior>
              <Tab
                component="a"
                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                  setValue(3);
                }}
                key={3}
                value={3}
                label="Followers"
                icon={
                  <Badge
                    sx={{
                      p: {
                        xs: '6px 1px',
                        sm: '6px 3px',
                      }
                    }}
                    showZero
                    max={Number.MAX_SAFE_INTEGER}
                    badgeContent={humanize.compactInteger(followersCount, 1)}
                  >
                  </Badge>
                }
                iconPosition="end"
                sx={{
                  minWidth: 0,
                  width: {
                    xs: '25%',
                    sm: '120px',
                  },
                  paddingX: {
                    xs: 1.75,
                    sm: 2
                  },
                  paddingY: 2,
                  margin: 0
                }}
              />
            </Link>
          </Tabs>
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
