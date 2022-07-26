import { Box, Grid, Typography } from "@mui/material"
import { LoginLogoutButton } from "../menu/LoginLogoutButton"

export const HomePagePitch = ({ }) => {
    return (
        <Grid
            container
            sx={{
                padding: {
                    'xs': 6,
                    'sm': 8,
                    'xl': 12,
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
                    gap={0}
                    height="100%"
                    sx={{
                        paddingY: 4,
                    }}
                >
                    <Box
                        component="span"
                        sx={{
                            fontFamily: theme => theme.logo.fontFamily,
                            fontSize: {
                                xs: '30px',
                                sm:'40px',
                            },
                            fontWeight: 600,
                            color: theme => theme.palette.primary.main
                        }}>
                        Hodl My Moon

                    </Box>
                    <Typography
                        sx={{
                            fontFamily: theme => theme.logo.fontFamily,
                            fontSize: '25px',
                            color: '#999'
                        }}>
                        is a social NFT platform
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
                        height:{
                            sm: "100%"
                        },
                        padding: {
                            xs: 0,
                        }
                    }}
                >
                    <Box>
                        <LoginLogoutButton
                            variant="contained"
                            fontSize='18px'
                            sx={{ 
                                fontFamily: theme => theme.logo.fontFamily,
                                paddingY: {
                                    xs: 1,
                                    sm: 1.5
                                },
                                paddingX: {
                                    xs: 2,
                                    sm: 4 
                                }
                            }}
                        />
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}