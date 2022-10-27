
import Skeleton from "@mui/material/Skeleton"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

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
                                    paddingBottom: { xs: '50px', sm: '75px', md: `100px`, lg: '125px', xl: '150px' },

                                }}
                            >
                                <Skeleton variant="text" animation="wave">
                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: 30,
                                                sm: 35,
                                                md: 40
                                            },
                                            fontWeight: 600,
                                            marginBottom: 2
                                        }}>
                                        Hodl My Moon
                                    </Typography>
                                </Skeleton>
                                <Skeleton variant="text" animation="wave">
                                    <Typography sx={{ fontSize: { xs: 20, sm: 22, }, }}>a web3 social network</Typography>
                                </Skeleton>
                                <Skeleton variant="text" animation="wave">
                                    <Typography sx={{ fontSize: { xs: 20, sm: 22, }, }}>and marketplace</Typography>
                                </Skeleton>
                                <Box
                                    sx={{
                                        marginTop: { xs: '40px', md: '50px' },
                                    }}>
                                    <Skeleton variant="rectangular" animation="wave" />
                                </Box>
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
                                    height="400px"
                                    width="400px"
                                    variant="rectangular"
                                    animation="wave"
                                />
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
                <Box>
                    <Skeleton variant="text" animation="wave" height={28} sx={{ marginBottom: 1 }}></Skeleton>
                    <Skeleton variant="rectangular" animation="wave" height={250} sx={{ borderRadius: 1 }}></Skeleton>
                </Box>
                <Box>
                    <Skeleton variant="text" animation="wave" height={28} sx={{ marginBottom: 1 }}></Skeleton>
                    <Skeleton variant="rectangular" animation="wave" height={250} sx={{ borderRadius: 1 }}></Skeleton>
                </Box>
                <Box>
                    <Skeleton variant="text" animation="wave" height={28} sx={{ marginBottom: 1 }}></Skeleton>
                    <Skeleton variant="rectangular" animation="wave" height={250} sx={{ borderRadius: 1 }}></Skeleton>
                </Box>
                <Box>
                    <Skeleton variant="text" animation="wave" height={28} sx={{ marginBottom: 1 }}></Skeleton>
                    <Skeleton variant="rectangular" animation="wave" height={250} sx={{ borderRadius: 1 }}></Skeleton>
                </Box>
            </Box>
        </Box >
    )
}

export default PublicHomePageLoading