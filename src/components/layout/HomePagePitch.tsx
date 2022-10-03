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
                            paddingTop: {xs: 0, sm: '25px', md: '50px', lg: '75px', xl: '100px'},
                            paddingBottom: { xs: '50px', sm: '75px', md:`100px`, lg: '125px', xl: '150px'},
                            
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
                                marginBottom: 2
                            }}>
                            Hodl My Moon

                        </Box>
                        <Typography
                            sx={{
                                fontFamily: theme => theme.logo.fontFamily,
                                fontSize: {
                                    xs: 20,
                                    sm: 25,
                                    md: 30
                                },
                                color: '#999'
                            }}>
                            is a web3 social network<br/> and marketplace
                        </Typography>
                        <Box
                            sx={{
                                marginTop: {xs: '40px', md: '50px'},
                            }}>
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
                            maxWidth: '90%',
                        }}>
                            <NftWindow 
                                nft={
                                    mostLiked.data?.[0].items?.[0]
                                } 
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}