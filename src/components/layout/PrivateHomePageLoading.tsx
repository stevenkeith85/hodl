import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { RankingListLoading } from './RankingListLoading';
import { CircularProgress, LinearProgress, Skeleton, Typography } from '@mui/material';
import { HodlBorderedBox } from '../HodlBorderedBox';

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
            <Grid
                container
            >
                <Grid
                    sx={{
                        display:
                        {
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
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            // justifyContent: 'center',
                            width: '100%',
                            height: '100vh',
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
                        <Box sx={{ padding: 2 }}>
                            <CircularProgress size={22} sx={{ margin: 2, color: '#ddd' }} />
                        </Box>
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
                    <Box
                        display="flex"
                        flexDirection="column"
                        sx={{
                            marginY: {
                                xs: 2,
                                md: 4,
                            },
                            marginX: {
                                xs: 0,
                                sm: 4
                            },
                            marginTop: {
                                xs: 1,
                                md: 4
                            },
                            gap: 4,
                        }}
                    >
                        <HodlBorderedBox
                            sx={{
                                width: `100%`,
                            }}
                        >
                            <Box
                                display="flex"
                                flexDirection={"column"}
                                justifyContent="space-evenly"
                                alignItems={"start"}
                                sx={{
                                    gap: 2,
                                }}
                            >
                                <Box
                                    display="flex"
                                    gap={2}
                                    alignItems={"center"}
                                >
                                    <Skeleton variant="circular" animation="wave" width={70} height={70} />
                                    <Skeleton variant="text" animation="wave" width={70} height={18} />
                                </Box>
                                <Box
                                    display="grid"
                                    gridTemplateColumns="1fr 1fr 1fr 1fr"
                                    sx={{
                                        paddingX: 1,
                                        width: '100%',
                                        gap: 1
                                    }}
                                >
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Skeleton variant="circular" animation="wave" width={18} height={18} />
                                        <Skeleton variant="text" animation="wave"><Typography>Hodling</Typography></Skeleton>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Skeleton variant="circular" animation="wave" width={18} height={18} />
                                        <Skeleton variant="text" animation="wave"><Typography>Listed</Typography></Skeleton>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Skeleton variant="circular" animation="wave" width={18} height={18} />
                                        <Skeleton variant="text" animation="wave"><Typography>Following</Typography></Skeleton>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Skeleton variant="circular" animation="wave" width={18} height={18} />
                                        <Skeleton variant="text" animation="wave"><Typography>Followers</Typography></Skeleton>
                                    </Box>
                                </Box>
                            </Box>
                        </HodlBorderedBox>
                        <RankingListLoading text="Top Users" />
                        <RankingListLoading text="Top Tokens" />
                        <RankingListLoading text="New Users" />
                        <RankingListLoading text="New Tokens" />
                    </Box>
                </Grid>

            </Grid>
        </>
    )
}

export default PrivateHomePageLoading
