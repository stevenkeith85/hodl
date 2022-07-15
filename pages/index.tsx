import Head from 'next/head';
import { Box, Grid, Typography } from '@mui/material';
import { HodlFeed } from '../components/feed/HodlFeed';
import { ProfileAvatar } from '../components';
import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { ProfileNameOrAddress } from '../components/avatar/ProfileNameOrAddress';
import { useFollowers } from '../hooks/useFollowers';
import { useFollowing } from '../hooks/useFollowing';
import { useHodling } from '../hooks/useHodling';
import { useListed } from '../hooks/useListed';
import humanize from "humanize-plus";

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
        >
          <Grid
            item xs={12}
            md={7}
          >
            <HodlFeed />
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
          >
            <Box display="flex" paddingX={6} paddingY={4}>
              <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                borderRadius={1}
                width="100%"
                height="120px"
                gap={1}
                sx={{
                  padding: 1,
                  border: '1px solid #ddd',
                  boxShadow: '0 0 2px 1px #eee'
                }}
              >
                <Box flexGrow={1} display="flex" justifyContent="center">
                  <ProfileAvatar profileAddress={address} size="large" showNickname={false} />
                </Box>

                <Box
                  flexGrow={1}
                  display="flex"
                  alignContent="center"
                  flexDirection="column"
                  gap={1}
                  padding={0}
                >
                  {address &&
                    <ProfileNameOrAddress color={"primary"} profileAddress={address} size={"medium"} sx={{ fontWeight: 600 }}
                    />}

                  <Box
                    display="grid"
                    gap={1}
                    gridTemplateColumns="1fr 1fr"
                    gridTemplateRows="1fr 1fr"
                  >
                    {!isNaN(hodlingCount) &&
                      <Typography sx={{ span: { fontWeight: 600 } }}><span>{humanize.compactInteger(hodlingCount, 1)}</span> Hodling</Typography>
                    }
                    {!isNaN(listedCount) &&
                      <Typography sx={{ span: { fontWeight: 600 } }}><span>{humanize.compactInteger(listedCount, 1)}</span> Listed</Typography>
                    }
                    {!isNaN(followersCount) &&
                      <Typography sx={{ span: { fontWeight: 600 } }}><span>{humanize.compactInteger(followersCount, 1)}</span> Followers</Typography>
                    }
                    {!isNaN(followingCount) &&
                      <Typography sx={{ span: { fontWeight: 600 } }}><span>{humanize.compactInteger(followingCount, 1)}</span> Following</Typography>
                    }
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

