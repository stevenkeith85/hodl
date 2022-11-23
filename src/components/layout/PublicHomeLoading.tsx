
import Skeleton from "@mui/material/Skeleton"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { RankingListLoading } from "./RankingListLoading"

const PublicHomePageLoading = ({ }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box display="flex">
                <Box
                    sx={{
                        paddingY: { xs: `50px`, md: '80px' },
                        width: `100%`,
                    }}>
                    <Grid container>
                        <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                            }}
                        >
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                gap={0}
                                height="100%"
                                sx={{
                                    paddingTop: { xs: 0, sm: '25px', md: '50px', lg: '75px', xl: '100px' },
                                    paddingBottom: { xs: '60px', sm: '75px', md:`100px`, lg: '120px', xl: '140px'},
                                }}
                            >
                                <Skeleton variant="text" animation="wave">
                                    <Box
                                        component="span"
                                        sx={{
                                            fontFamily: theme => theme.logo.fontFamily,
                                            fontSize: {
                                                xs: 30,
                                                sm: 35,
                                                md: 40
                                            },
                                            fontWeight: 600,
                                            marginBottom: 2
                                        }}>
                                        Hodl My Moon
                                    </Box>
                                </Skeleton>
                                <Skeleton variant="text" animation="wave">
                                    <Typography
                                        sx={{
                                            fontFamily: theme => theme.logo.fontFamily,
                                            fontSize: {
                                                xs: 20,
                                                sm: 22,
                                            },
                                        }}>
                                        is a web3 social network</Typography>
                                </Skeleton>
                                <Skeleton variant="text" animation="wave">
                                    <Typography
                                        sx={{
                                            fontFamily: theme => theme.logo.fontFamily,
                                            fontSize: {
                                                xs: 20,
                                                sm: 22,
                                            },
                                        }}>and nft marketplace</Typography>
                                </Skeleton>
                                {/* <Box
                                    sx={{
                                        marginTop: { xs: '40px', md: '50px' },
                                    }}>
                                    <Skeleton variant="rounded" animation="wave">
                                        <Button sx={{
                                            fontSize: {
                                                xs: '16px',
                                                sm: '18px',
                                            },
                                            width: {
                                                xs: '116px',
                                                sm: '155px',
                                            },
                                            paddingY: {
                                                xs: 1,
                                                sm: 1.5
                                            },
                                        }}>Connect</Button>
                                    </Skeleton>
                                </Box> */}
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                            }}
                        >
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                gap={0}
                                sx={{
                                    height: { sm: "100%" },
                                }}
                            >
                                <Skeleton
                                    variant="rectangular"
                                    animation="wave"
                                >
                                    <Box sx={{
                                        width: 400,
                                        height: 400
                                    }}>
                                        &nbsp;
                                    </Box>
                                </Skeleton>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: `1fr`,
                        sm: `1fr 1fr`,
                    },
                    marginY: {
                        xs: 2,
                        sm: 4
                    },
                    marginX: {
                        xs: 0,
                        sm: 4
                    },
                    marginTop: {
                        xs: 0,
                        sm: 4
                    },
                    gap: 4,
                }}
            >
                <RankingListLoading text="Top Users" />
                <RankingListLoading text="Top Tokens" />
                <RankingListLoading text="New Users" />
                <RankingListLoading text="New Tokens" />
            </Box>
        </Box >
    )
}

export default PublicHomePageLoading