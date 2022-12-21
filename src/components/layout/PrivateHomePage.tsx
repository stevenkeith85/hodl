import { useState } from 'react';

import dynamic from 'next/dynamic';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


const HodlFeed = dynamic(
    () => import('../feed/HodlFeed').then(mod => mod.HodlFeed),
    {
        ssr: true,
        loading: () => null
    }
);

const PrivateHomePageSwitch = dynamic(
    () => import('./PrivateHomePageSwitch'),
    {
        ssr: true,
        loading: () => null
    }
);

const PrivateHomePageSidebar = dynamic(
    () => import('./PrivateHomePageSidebar'),
    {
        ssr: true,
        loading: () => null
    }
);

const PrivateHomePage = ({ user }) => {
    const theme = useTheme();

    const desktop = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });

    const [viewSidebar, setViewSidebar] = useState(false);

    return (
        <>
            <PrivateHomePageSwitch viewSidebar={viewSidebar} setViewSidebar={setViewSidebar} />
            <Grid container>
                <Grid
                    item
                    sx={{
                        display: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }
                    }}
                    xs={12}
                    md={7}
                >
                    {(desktop || !viewSidebar) &&
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: `min(530px, 100%)`,
                                marginY: {
                                    xs: 2,
                                    md: 4,
                                },
                                marginX: {
                                    xs: 0,
                                },
                                marginTop: {
                                    xs: 1,
                                    md: 6
                                },
                                marginBottom: {
                                    xs: 0,
                                    sm: 4
                                },
                            }}>
                            <HodlFeed />
                        </Box>
                    }
                </Grid>
                <Grid item xs={12} md={5}>
                    <PrivateHomePageSidebar prefetchedUser={user}/>
                </Grid>
            </Grid>
        </>
    )
}

export default PrivateHomePage
