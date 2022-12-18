import { useState } from 'react';

import dynamic from 'next/dynamic';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import HodlFeedLoading from './HodlFeedLoading';
import PrivateHomePageSidebarLoading from './PrivateHomePageSidebarLoading';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PrivateHomePageSwitchLoading from './PrivateHomePageSwitchLoading';


const HodlFeed2 = dynamic(
    () => import('../feed/HodlFeed2').then(mod => mod.HodlFeed2),
    {
        ssr: false,
        loading: () => <HodlFeedLoading />
    }
);


const PrivateHomePageSwitch = dynamic(
    () => import('./PrivateHomePageSwitch'),
    {
        ssr: false,
        loading: () => <PrivateHomePageSwitchLoading />
    }
);

interface PrivateHomePageProps {
}

const PrivateHomePage: React.FC<PrivateHomePageProps> = ({ }) => {
    const theme = useTheme();

    const desktop = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });

    const [viewSidebar, setViewSidebar] = useState(false);

    const PrivateHomePageSidebar = dynamic(
        () => import('./PrivateHomePageSidebar'),
        {
            ssr: false,
            loading: () => <PrivateHomePageSidebarLoading display={desktop || viewSidebar} />
        }
    );

    return (
        <>
            {!desktop && <PrivateHomePageSwitch viewSidebar={viewSidebar} setViewSidebar={setViewSidebar} />}
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
                            <HodlFeed2 />
                        </Box>
                    }
                </Grid>
                {(desktop || viewSidebar) &&
                    <Grid item xs={12} md={5}>
                        <PrivateHomePageSidebar />
                    </Grid>
                }
            </Grid>
        </>
    )
}

export default PrivateHomePage
