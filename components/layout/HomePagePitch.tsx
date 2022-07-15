import { Box, Grid, Typography } from "@mui/material"
import { LoginLogoutButton } from "../menu/LoginLogoutButton"

export const HomePagePitch = ({ }) => {
    return (
        <Grid
            container
            maxWidth="1200px"
            margin="0 auto"
            sx={{
                padding: {
                    'xs': 4,
                    'sm': 6,
                    'md': 8,
                }
            }}
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
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    gap={4}
                    height="100%"
                    sx={{
                        padding: 4,
                    }}
                >
                    <Box
                        component="span"
                        sx={{
                            fontSize: '40px',
                            fontWeight: 600,
                            color: theme => theme.palette.primary.main
                        }}>
                        Hodl My Moon

                    </Box>
                    <Typography
                        sx={{
                            fontFamily: theme => theme.logo.fontFamily,
                            fontSize: '25px'
                        }}>
                        is an NFT Social Platform
                    </Typography>
                    {/* <Typography
                        sx={{
                            fontFamily: theme => theme.logo.fontFamily,
                            fontSize: '20px'
                        }}>
                            Create, Hodl, and Trade NFTs
                    </Typography> */}
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
                    gap={4}
                    height="100%"
                    sx={{
                        padding: 4,
                    }}
                >
                    <Box>
                        <LoginLogoutButton
                            variant="contained"
                            fontSize='20px'
                            sx={{ paddingY: 1.5, paddingX: 4 }}
                        />
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}