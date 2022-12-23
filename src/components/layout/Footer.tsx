import { grey } from "@mui/material/colors";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import RedditIcon from "@mui/icons-material/Reddit";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MuiLink from "@mui/material/Link";
import { TikTokIcon } from "../TikTokIcon";

const Footer = ({
    address
}) => {
    return (
        <div>
            <Box sx={{
                backgroundColor: '#efefef',
                borderTop: `1px solid #eee`,
                borderBottom: `1px solid #eee`
            }}
            >

                <Container
                    maxWidth="xl"
                    sx={{
                        display: 'flex',
                        flexDirection: {
                            xs: 'column',
                            md: 'row'
                        },
                        paddingY: 6,
                        gap: {
                            xs: 6,
                            md: 12
                        }
                    }}>

                    <Box
                        display="flex"
                        flexDirection={"column"}
                        gap={3}
                        sx={{
                            width: {
                                xs: '100%',
                                md: '25%',
                            },
                            textAlign: {
                                xs: 'center',
                                md: 'left'
                            },
                            alignItems: {
                                xs: 'center',
                                md: 'start'
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1
                            }}
                        >
                            <Link style={{ textDecoration: 'none' }} href="/">
                                <Typography
                                    variant="h2"
                                    sx={{
                                        padding: 0,
                                        margin: 0,
                                        marginBottom: 1,
                                        lineHeight: '25px',
                                        fontFamily: theme => theme.logo.fontFamily,
                                        fontSize: theme => theme.logo.fontSize,
                                        color: theme => theme.palette.primary.main
                                    }}>
                                    Hodl My Moon
                                </Typography>
                            </Link>
                            <Typography color="text.secondary">Mint, buy, and sell non-fungible tokens</Typography>
                            <Typography color="text.secondary">on the Polygon blockchain.</Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                textAlign: {
                                    xs: 'center',
                                    md: 'left'
                                }
                            }}>

                            <MuiLink href="https://www.facebook.com/profile.php?id=100086969439067" target="_blank">
                                <FacebookIcon sx={{ color: grey[500] }} />
                            </MuiLink>
                            <MuiLink href="https://twitter.com/hodlmymoon" target="_blank">
                                <TwitterIcon sx={{ color: grey[500] }} />
                            </MuiLink>
                            <MuiLink href="https://www.reddit.com/r/hodlmymoon/" target="_blank">
                                <RedditIcon sx={{ color: grey[500] }} />
                            </MuiLink>
                            <MuiLink href="https://www.instagram.com/hodlmymoon/" target="_blank">
                                <InstagramIcon sx={{ color: grey[500] }} />
                            </MuiLink>
                            <MuiLink href="https://www.youtube.com/@hodlmymoon" target="_blank">
                                <YouTubeIcon sx={{ color: grey[500] }} />
                            </MuiLink>
                            <MuiLink href="https://www.tiktok.com/@hodlmymoon" target="_blank">
                                <Box sx={{
                                    width: 22,
                                    height: 22
                                }}>
                                    <TikTokIcon color={grey[500]} />
                                </Box>
                                
                            </MuiLink>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            width: {
                                xs: '100%',
                                md: '75%'
                            },
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: '1fr 1fr 1fr'
                            },
                            gap: {
                                xs: 6,
                                md: 8
                            },
                            textAlign: {
                                xs: 'center',
                                md: 'left'
                            }
                        }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    padding: 0,
                                    margin: 0,
                                    marginBottom: 1,
                                    lineHeight: '25px',
                                }}>
                                Company
                            </Typography>
                            <Link style={{ textDecoration: 'none' }} href="/about"><Typography color="text.secondary">about</Typography></Link>
                            <Link style={{ textDecoration: 'none' }} href="/contact"><Typography color="text.secondary">contact</Typography></Link>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1
                            }}
                        >
                            <Typography sx={{
                                fontWeight: 600,
                                padding: 0,
                                margin: 0,
                                marginBottom: 1,
                                lineHeight: '25px',
                            }}>NFTs</Typography>
                            <Link style={{ textDecoration: 'none' }} href="/explore"><Typography color="text.secondary">explore</Typography></Link>
                            <Link style={{ textDecoration: 'none' }} href="/explore?forSale=true"><Typography color="text.secondary">buy</Typography></Link>
                            {
                                address &&
                                <Link style={{ textDecoration: 'none' }} href="/create"><Typography color="text.secondary">create</Typography></Link>
                            }
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    padding: 0,
                                    margin: 0,
                                    marginBottom: 1,
                                    lineHeight: '25px',
                                }}>
                                Learn
                            </Typography>
                            <Link style={{ textDecoration: 'none' }} href="/learn"><Typography color="text.secondary">overview</Typography></Link>
                            <Link style={{ textDecoration: 'none' }} href="/learn/nfts/what-are-nfts"><Typography color="text.secondary">what are nfts</Typography></Link>
                            <Link style={{ textDecoration: 'none' }} href="/learn/nfts/how-much-does-it-cost-to-create-an-nft"><Typography color="text.secondary">costs creating an nft</Typography></Link>
                            <Link style={{ textDecoration: 'none' }} href="/learn/nfts/nft-scoring-what-is-nft-rarity"><Typography color="text.secondary">scoring nft rarity</Typography></Link>
                            <Link style={{ textDecoration: 'none' }} href="/learn/dapps/what-are-dapps"><Typography color="text.secondary">what are dapps</Typography></Link>
                            <Link style={{ textDecoration: 'none' }} href="/learn/dapps/interact-with-dapps"><Typography color="text.secondary">interact with dapps</Typography></Link>
                            <Link style={{ textDecoration: 'none' }} href="/learn/sign-in/coinbase-wallet"><Typography color="text.secondary">connect with coinbase wallet</Typography></Link>
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Box sx={{ backgroundColor: 'white' }}>
                <Container
                    maxWidth="xl"
                    sx={{
                        boxSizing: 'border-box',
                        padding: 2
                    }}>
                    <Box>
                        <Typography
                            sx={{
                                color: grey[500],
                                fontSize: '12px',
                                textAlign: {
                                    xs: 'center',
                                    md: 'right'
                                }
                            }}>
                            Copyright © 2022 Pony Powered Limited.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </div >
    )
}

export default Footer;

