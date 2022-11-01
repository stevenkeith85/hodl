import { Box, Grid, Typography } from "@mui/material"
import { useContext } from "react";
import { RankingsContext } from "../../contexts/RankingsContext";
import { LoginLogoutButton } from "../menu/LoginLogoutButton"
import { NftWindow } from "../NftWindow"

export const HomePagePitch = ({ }) => {
    const { mostLiked } = useContext(RankingsContext);

    return (
        <Box
            sx={{
                paddingY:{ xs:`50px`, md: '80px' },
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
                            paddingTop: {xs: 0, sm: '25px', md: '50px', lg: '70px', xl: '90px'},
                            paddingBottom: { xs: '64px', sm: '75px', md:`100px`, lg: '120px', xl: '140px'},
                        }}
                    >
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
                                color: theme => theme.palette.primary.main,
                                marginBottom: 1,
                            }}>
                            Hodl My Moon
                        </Box>
                        <Typography
                            sx={{
                                fontFamily: theme => theme.logo.fontFamily,
                                fontSize: {
                                    xs: 18,
                                    sm: 22,
                                },
                                color: '#999'
                            }}>
                            a web3 social network<br/> and marketplace
                        </Typography>
                        <Box
                            sx={{
                                marginTop: {xs: '32px', md: '50px'},
                            }}>
                            <LoginLogoutButton
                                variant="contained"
                                sx={{
                                    fontFamily: theme => theme.logo.fontFamily,
                                    fontSize: {
                                        xs: '16px',
                                        sm: '18px',
                                    },
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
                            height: {sm: "100%"},
                        }}
                    >
                        <Box sx={{ 
                            width: `400px`, 
                            maxWidth: '100%',
                        }}>
                            <NftWindow nft={mostLiked.data?.[0].items?.[0]} lcp={true} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}