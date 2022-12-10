import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";


export const HomePagePitchLoading = ({ }) => {
    return (
        <Box
            sx={{
                paddingY: {
                    xs: `50px`,
                    md: '80px'
                },
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
                            paddingTop: { xs: 0, sm: '25px', md: '50px', lg: '70px', xl: '90px' },
                            paddingBottom: { xs: '70px', sm: '75px', md: `100px`, lg: '120px', xl: '140px' },
                        }}
                    >
                        <Box
                            component="h1"
                            sx={{
                                fontFamily: theme => theme.logo.fontFamily,
                                fontSize: {
                                    xs: 26,
                                    sm: 35,
                                    md: 40
                                },
                                fontWeight: 500,
                                color: theme => theme.palette.primary.dark,
                                marginBottom: 2,
                            }}>
                            The social NFT marketplace for Polygon
                        </Box>
                        <Typography
                            component="h2"
                            sx={{
                                fontFamily: theme => theme.logo.fontFamily,
                                fontSize: {
                                    xs: 18,
                                    sm: 22,
                                },
                                marginBottom: 1,
                                color: '#999'
                            }}>
                            Connect with NFT creators
                        </Typography>
                        <Typography
                            component="h2"
                            sx={{
                                fontFamily: theme => theme.logo.fontFamily,
                                fontSize: {
                                    xs: 18,
                                    sm: 22,
                                },
                                color: '#999'
                            }}>
                                Mint, buy or sell NFTs on Polygon
                            
                        </Typography>
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
                        <Skeleton variant="rectangular" width="400px" height="400px" sx={{ maxWidth: "100%" }}></Skeleton>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}
