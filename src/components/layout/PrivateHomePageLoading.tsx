import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import HodlFeedLoading from './HodlFeedLoading';
import PrivateHomePageSidebarLoading from './PrivateHomePageSidebarLoading';
import useMediaQuery from '@mui/material/useMediaQuery';
import theme from '../../theme';
import PrivateHomePageSwitchLoading from './PrivateHomePageSwitchLoading';

const PrivateHomePageLoading = ({ }) => {

    const desktop = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <>
            {!desktop && <PrivateHomePageSwitchLoading />}
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

                        <HodlFeedLoading />
                    </Box>
                </Grid>
                {desktop && <Grid
                    item
                    xs={12}
                    md={5}
                >
                    <PrivateHomePageSidebarLoading display={desktop} />
                </Grid>
                }
            </Grid>
        </>
    )
}

export default PrivateHomePageLoading
