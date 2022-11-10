import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Skeleton } from '@mui/material';
import HodlFeedLoading from './HodlFeedLoading';
import PrivateHomePageSidebarLoading from './PrivateHomePageSidebarLoading';

const PrivateHomePageLoading = ({ }) => {

    const [viewSidebar] = useState(false);

    return (
        <>
            <Box
                sx={{
                    display: {
                        xs: 'flex',
                        md: 'none'
                    },
                    justifyContent: 'right',
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        marginTop: 1,
                        marginX: {
                            xs: 0,
                            sm: 4
                        }
                    }}
                >
                    <Skeleton variant="rounded" animation="wave" width="35px" height="15px" sx={{ marginY: 2 }} />
                </Box>
            </Box>
            <Grid container>
                <Grid
                    sx={{
                        display: {
                            xs: !viewSidebar ? 'flex' : 'none',
                            md: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }
                    }}
                    item xs={12}
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
                                md: 4
                            },
                            marginBottom: {
                                xs: 0,
                                sm: 4
                            },
                        }}>
                        <HodlFeedLoading />
                    </Box>
                </Grid>
                <Grid
                    sx={{
                        display: {
                            xs: viewSidebar ? 'block' : 'none',
                            md: 'block'
                        }
                    }}
                    item
                    xs={12}
                    md={5}
                >
                    <PrivateHomePageSidebarLoading />
                </Grid>
            </Grid>
        </>
    )
}

export default PrivateHomePageLoading
