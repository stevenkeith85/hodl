import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRankings } from "../../hooks/useRankings";
import { ConnectButton } from "../menu/ConnectButton";


import dynamic from "next/dynamic";


const NftWindow = dynamic(
    () => import('../NftWindow').then(mod => mod.NftWindow),
    {
      ssr: true,
      loading: () => null
    }
  );

  const Carousel = dynamic(
    () => import('react-material-ui-carousel'),
    {
      ssr: true,
      loading: () => null
    }
  );


export const HomePagePitch = ({ limit, prefetchedTopTokens }) => {
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
                padding: {
                    xs: 2,
                    md: 4
                },
                gap: {
                    xs: 2,
                    md: 4,
                },
                background: 'white',
                border: '1px solid #eee',
                borderRadius: 2,
                alignItems: 'center',
                minHeight: '470px',
            }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: {
                        xs: 'center',
                        lg: 'left'
                    },
                    paddingX: 2,
                    paddingY: {
                        xs: 4,
                    }
                }}
            >
                <Typography
                    component="h1"
                    variant="h1"
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        color: theme => theme.palette.primary.main,
                        fontSize: {
                            xs: 32,
                            sm: 33,
                            md: 34,
                        },
                        fontWeight: 500,
                        marginBottom: 1
                    }}>
                    Hodl My Moon
                </Typography>
                <Typography
                    component="h2"
                    variant="h2"
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        color: theme => theme.palette.text.secondary,
                        fontSize: {
                            xs: 18,
                            sm: 19,
                            md: 20,
                        },
                        margin: 0,
                        padding: 0,
                        marginBottom: {
                            xs: 4,
                        }
                    }}>
                    The social NFT platform
                </Typography>
                <Typography
                    component="ul"
                    sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        color: theme => theme.palette.text.secondary,
                        listStyleType: {
                            xs: 'none',
                            lg: 'disc'
                        },
                        margin: 0,
                        padding: 0,
                        paddingLeft: {
                            lg: 2
                        },
                        marginBottom: {
                            xs: 4,
                        }
                    }}>
                    <Typography component="li" sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        color: theme => theme.palette.text.secondary,
                        marginBottom: 1,
                        fontSize: {
                            xs: 14,
                            sm: 15,
                            md: 16,
                        },
                    }}>Easily mint Polygon NFTs</Typography>
                    <Typography component="li" sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        color: theme => theme.palette.text.secondary,
                        marginBottom: 1,
                        fontSize: {
                            xs: 14,
                            sm: 15,
                            md: 16,
                        },
                    }}>Make frens</Typography>
                    <Typography component="li" sx={{
                        fontFamily: theme => theme.logo.fontFamily,
                        color: theme => theme.palette.text.secondary,
                        marginBottom: 1,
                        fontSize: {
                            xs: 14,
                            sm: 15,
                            md: 16,
                        },
                    }}>Buy or sell on the Polygon NFT Marketplace</Typography>
                </Typography>
                <div>
                    <ConnectButton
                        text="Connect to Get Started"
                        sx={{
                            paddingX: 4,
                            paddingY: 1.5,
                            fontWeight: 600,
                            fontSize: {
                                xs: 14,
                                sm: 15
                            }
                        }} />
                </div>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: {
                        xs: '350px',
                        sm: '400px',
                        md: '470px',
                        lg: '520px'
                    }
                }}
            >
                <Box sx={{
                    width: `100%`,
                    height: `100%`,
                    maxWidth: '100%',
                }}>
                    <Carousel
                        indicators={false}
                        interval={6000}
                    >
                        {mostLiked.data?.[0].items.map(nft =>
                            <NftWindow
                                key={nft?.id}
                                nft={nft}
                                lcp={true}
                                sizes="(min-width: 900px) 400px, 100vw"
                                widths={[800, 900, 1080]}
                            />
                        )}
                    </Carousel>
                </Box>
            </Box>
        </Box>
    )
}
