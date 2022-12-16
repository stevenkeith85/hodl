import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useContext } from "react";

import { RankingsContext } from "../../contexts/RankingsContext";

import { NftWindow } from "../NftWindow"

export const HomePagePitch = ({ }) => {
    const { mostLiked } = useContext(RankingsContext);

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr'
                },
                marginY: 4,
                paddingX: 4,
                paddingY: 4,
                gap: 4,
                background: '#f6f6f6',
                borderRadius: 2,
                textAlign: {
                    xs: 'center',
                    sm: 'left'
                },
                alignItems: 'center',
            }}>
            <Box>
                <Box
                    component="h1"
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        fontSize: {
                            xs: 20,
                            sm: 24,
                            md: 28,
                        },
                        fontWeight: 500,
                        margin: 0,
                        marginBottom: 2,
                        color: theme => theme.palette.primary.main,
                    }}>
                    The Social Polygon NFT Marketplace
                </Box>
                <Typography
                    component="h2"
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        fontSize: {
                            xs: 14,
                            sm: 16,
                            md: 18,
                        },
                        marginBottom: 4,
                        color: theme => theme.palette.text.secondary
                    }}>
                    Mint, buy and sell NFTs on the Polygon blockchain
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box sx={{
                    width: `100%`,
                    maxWidth: '100%',
                }}>
                    <NftWindow
                        nft={mostLiked.data?.[0].items?.[0]}
                        lcp={true}
                        sizes="(min-width: 900px) 400px, 100vw"
                        widths={[800, 900, 1080]}
                    />
                </Box>
            </Box>
        </Box>
    )
}
