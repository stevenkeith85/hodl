import { Box, Grid, Typography } from "@mui/material"

export const FeedPreview = ({ }) => {
    return (
        <Grid
            container
            // spacing={4}
            maxWidth="1200px"
            margin="0 auto"
            minHeight={400}
        >
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
                    gap={2}
                    height="100%"
                    sx={{
                        padding: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        gap={4}
                        padding={4}>
                        <Box
                            component="span"
                            sx={{
                                fontSize: '35px',
                                fontWeight: 600,
                            }}>
                            Follow
                        </Box>
                        <Typography
                            sx={{
                                fontFamily: theme => theme.logo.fontFamily,
                                fontSize: '25px'
                            }}>
                            your favourite users
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: theme => theme.logo.fontFamily,
                                fontSize: '20px'
                            }}>
                            to see their new digital assets
                        </Typography>
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
                    alignItems={"center"}
                    gap={4}
                >
                    <Box sx={{ img: {border: '2px solid black', width: '500px', maxWidth: '100%'}}}>
                        <img src={'/mobile-feed.png'}  />
                    </Box>


                </Box>
            </Grid>

        </Grid>
    )
}