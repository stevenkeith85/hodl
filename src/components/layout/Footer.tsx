import { grey } from "@mui/material/colors";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from 'next/link';


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
                        boxSizing: 'border-box',
                        paddingY: 4
                    }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: {
                                xs: 'column-reverse',
                                md: 'row'
                            },
                            gap: {
                                xs: 6,
                                md: 10
                            },
                            justifyContent: {
                                md: 'space-between'
                            },
                            alignItems: {
                                xs: 'center',
                                md: 'start'
                            },
                            textAlign: {
                                xs: 'center',
                                md: 'left'
                            }
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: {
                                    xs: 'column-reverse',
                                    md: 'row'
                                },
                                gap: {
                                    xs: 6,
                                    md: 12
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1.5,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        marginBottom: 0.5,
                                    }}>
                                    hodl my moon
                                </Typography>
                                <Link style={{ textDecoration: 'none' }} href="/about"><Typography color="text.secondary">about this dapp</Typography></Link>
                                <Link style={{ textDecoration: 'none' }} href="/contact"><Typography color="text.secondary">contact hodl my moon</Typography></Link>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1.5,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        marginBottom: 0.5,
                                    }}>
                                    learn
                                </Typography>
                                <Link style={{ textDecoration: 'none' }} href="/learn"><Typography color="text.secondary">nfts and dapps</Typography></Link>
                                <Link style={{ textDecoration: 'none' }} href="/learn/nfts/what-are-nfts"><Typography color="text.secondary">what are nfts</Typography></Link>
                                <Link style={{ textDecoration: 'none' }} href="/learn/nfts/how-much-does-it-cost-to-create-an-nft"><Typography color="text.secondary">how much does it cost to create an nft</Typography></Link>
                                <Link style={{ textDecoration: 'none' }} href="/learn/nfts/nft-scoring-what-is-nft-rarity"><Typography color="text.secondary">scoring nft rarity</Typography></Link>
                                <Link style={{ textDecoration: 'none' }} href="/learn/dapps/what-are-dapps"><Typography color="text.secondary">what are dapps</Typography></Link>
                                <Link style={{ textDecoration: 'none' }} href="/learn/dapps/interact-with-dapps"><Typography color="text.secondary">interact with dapps</Typography></Link>
                                <Link style={{ textDecoration: 'none' }} href="/learn/sign-in/coinbase-wallet"><Typography color="text.secondary">sign in with coinbase wallet</Typography></Link>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1.5,
                                }}
                            >
                                <Typography sx={{ fontWeight: 600, marginBottom: 0.5 }}>polygon nfts</Typography>
                                <Link style={{ textDecoration: 'none' }} href="/explore"><Typography color="text.secondary">explore polygon nfts</Typography></Link>
                                <Link style={{ textDecoration: 'none' }} href="/explore?forSale=true"><Typography color="text.secondary">buy polygon nfts</Typography></Link>
                                {
                                    address &&
                                    <Link style={{ textDecoration: 'none' }} href="/create"><Typography color="text.secondary">create</Typography></Link>
                                }
                            </Box>
                        </Box>
                        <Box
                            display="flex"
                            flexDirection={"column"}
                            gap={0.5}
                            sx={{
                                textAlign: {
                                    xs: 'center',
                                    md: 'right'
                                }
                            }}
                        >
                            <Link style={{ textDecoration: 'none' }} href="/">
                                <Typography
                                    variant="h2"
                                    sx={{
                                        padding: 0,
                                        margin: 0,
                                        fontFamily: theme => theme.logo.fontFamily,
                                        fontSize: theme => theme.logo.fontSize,
                                        color: theme => theme.palette.primary.main
                                    }}>
                                    Hodl My Moon
                                </Typography>
                            </Link>
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

