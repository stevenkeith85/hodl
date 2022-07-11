import Head from 'next/head';
import { getListed } from './api/market/listed';
import { useMarket } from '../hooks/useMarket';
import { InfiniteScrollTab } from '../components/profile/InfiniteScrollTab';
import { Box, Grid, Typography } from '@mui/material';
import { HodlNotifications } from '../components/notifications/HodlNotifications';
import { HodlFeed } from '../components/feed/HodlFeed';
import { ProfileAvatar } from '../components';
import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { ProfileNameOrAddress } from '../components/avatar/ProfileNameOrAddress';
import { useFollowers } from '../hooks/useFollowers';
import { useFollowing } from '../hooks/useFollowing';
import { useHodling } from '../hooks/useHodling';
import { useListed } from '../hooks/useListed';
import { HodlImpactAlert } from '../components/HodlImpactAlert';
import { Logo } from '../components/Logo';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { ConnectButton } from '../components/ConnectButton';
import { indigo } from '@mui/material/colors';
import { PublicHomePage } from '../components/layout/PublicHomePage';
// TODO
// export async function getServerSideProps() {

// }


export default function Home({ limit, prefetchedListed }) {
  const { address } = useContext(WalletContext);

  const [hodlingCount] = useHodling(address, 0, null, null);
  const [listedCount] = useListed(address, 0, null, null);
  const [followersCount] = useFollowers(address, null, null);
  const [followingCount] = useFollowing(address, null, null);


  return (
    <>
      <Head>
        <title>HodlMyMoon</title>
        <meta name="description" content="Mint, Showcase, and Trade NFTs at HodlMyMoon"></meta>
      </Head>

      {!address &&
        <PublicHomePage />
      }
      {address &&
        <Grid
          container
        // spacing={8}
        >
          <Grid
            item xs={12}
            md={7}
            // marginY={0}
            sx={{
              // background: "lightyellow" 
            }}
          >
            <HodlFeed />
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            // marginY={2}
            // paddingY={2}
            sx={{
              // background: "lightblue" 
            }}
          >
            <Box display="flex" padding={2}>
              <Box
                sx={{
                  // background: "lightpink",
                  border: '1px solid #ddd',
                  boxShadow: '0 0 2px 1px #eee',
                }}
                alignItems="center"
                justifyContent="center"
                display="flex"
                borderRadius={1}
                // flexGrow={1}
                // position="fixed"
                // alignItems="center"
                padding={2}
                width="100%"
                gap={3}
              >
                <ProfileAvatar profileAddress={address} size="large" showNickname={false} />
                <Box display="flex" flexDirection="column" gap={0.5}>
                  {address && <ProfileNameOrAddress color={"primary"} profileAddress={address} size={"medium"} sx={{ fontWeight: 600 }} />}

                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Typography display="flex" flexDirection="column" sx={{ span: { fontWeight: 600 } }}><span>{new Intl.NumberFormat().format(hodlingCount)}</span> Hodling</Typography>
                    <Typography display="flex" flexDirection="column" sx={{ span: { fontWeight: 600 } }}><span>{new Intl.NumberFormat().format(listedCount)}</span> Listed</Typography>
                    <Typography display="flex" flexDirection="column" sx={{ span: { fontWeight: 600 } }}><span>{new Intl.NumberFormat().format(followersCount)}</span> Followers</Typography>
                    <Typography display="flex" flexDirection="column" sx={{ span: { fontWeight: 600 } }}><span>{new Intl.NumberFormat().format(followingCount)}</span> Following</Typography>
                  </Box>

                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      }
    </>
  )
}

