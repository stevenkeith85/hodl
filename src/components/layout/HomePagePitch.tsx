import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useContext } from "react";

import { RankingsContext } from "../../contexts/RankingsContext";

import { NftWindow } from "../NftWindow"

export const HomePagePitch = ({ }) => {
    const { mostLiked } = useContext(RankingsContext);

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
                            Mint, buy, or sell NFTs on Polygon
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
                        <Box sx={{
                            width: `400px`,
                            maxWidth: '100%',
                        }}>
                            <NftWindow
                                nft={mostLiked.data?.[0].items?.[0]} lcp={true}
                                sizes="(min-width: 900px) 50vw, (min-width: 1200px) calc(1200px / 5 * 2), 100vw"
                                widths={[600, 700, 800, 900, 1080]}
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}
