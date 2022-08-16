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
                paddingY:{ xs:`50px`, md: '100px' },
                width: `100%`
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
                            paddingY: { xs: '50px', md:`100px`},
                            paddingTop: {xs: 0, md: '50px'}
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                fontFamily: theme => theme.logo.fontFamily,
                                fontSize: {
                                    xs: '30px',
                                    sm: '40px',
                                },
                                fontWeight: 600,
                                color: theme => theme.palette.primary.main
                            }}>
                            Hodl My Moon

                        </Box>
                        <Typography
                            sx={{
                                fontFamily: theme => theme.logo.fontFamily,
                                fontSize: {
                                    xs: '20px',
                                    sm: '30px',
                                },
                                color: '#999'
                            }}>
                            a social web3 platform
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
                        <Box
                            sx={{ width: `400px`, maxWidth: '90%'}}>
                            <NftWindow nft={mostLiked.data?.[0].items?.[0]} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}