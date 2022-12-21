import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRankings } from "../../hooks/useRankings";
import { ConnectButton } from "../menu/ConnectButton";

import { NftWindow } from "../NftWindow"

export const HomePagePitch = ({ limit, prefetchedTopTokens}) => {
    const { rankings: mostLiked } = useRankings(true, limit, prefetchedTopTokens, "token");

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr'
                },
                marginY: {
                    xs: 4,
                    sm: 6
                },
                paddingX: 4,
                paddingY: 4,
                gap: 4,
                background: 'white',
                boxShadow: '1px 1px 8px #eee',
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
                        marginY: 2,
                        color: theme => theme.palette.primary.main,
                    }}>
                    The Social Polygon NFT Platform
                </Box>
                <Typography
                    component="h2"
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        fontSize: {
                            xs: 15,
                            sm: 16,
                            md: 18,
                        },
                        marginBottom: 4,
                        color: theme => theme.palette.text.secondary
                    }}>
                    Make frens. Mint NFTs. Buy and sell on the Marketplace.
                </Typography>
                <ConnectButton />
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
