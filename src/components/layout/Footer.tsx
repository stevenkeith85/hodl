import { grey } from "@mui/material/colors";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { RocketLaunchIcon } from "../icons/RocketLaunchIcon";


const Footer = ({
    address 
}) => {
    return (
        <div>
            <Box sx={{
                backgroundColor: '#efefef',
                borderTop: `1px solid #ddd`,
                borderBottom: `1px solid #ddd`
            }}
            >
                <Container
                    maxWidth="xl"
                    sx={{
                        boxSizing: 'border-box',
                        paddingY: 3
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
                                    gap: 1,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        marginBottom: 0.5,
                                    }}>
                                    hodl my moon
                                </Typography>
                                <Link href="/about">about this dapp</Link>
                                <Link href="/contact">contact hodl my moon</Link>

                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        marginBottom: 0.5,
                                    }}>
                                    learn
                                </Typography>
                                <Link href="/learn">nfts and dapps</Link>
                                <Link href="/learn/nfts/what-are-nfts">what are nfts</Link>
                                <Link href="/learn/dapps/what-are-dapps">what are dapps</Link>
                                <Link href="/learn/dapps/interact-with-dapps">interact with dapps</Link>
                                <Link href="/learn/sign-in/coinbase-wallet">sign in with coinbase wallet</Link>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                }}
                            >
                                <Typography sx={{ fontWeight: 600, marginBottom: 0.5 }}>polygon nfts</Typography>
                                <Link href="/explore">explore polygon nfts</Link>
                                <Link href="/explore?forSale=true">buy polygon nfts</Link>
                                {
                                    address &&
                                    <Link href="/create">create</Link>
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
                            <Typography
                                variant="h2"
                                sx={{
                                    fontFamily: theme => theme.logo.fontFamily,
                                    fontSize: theme => theme.logo.fontSize,
                                    color: theme => theme.palette.primary.main
                                }}>
                                Hodl My Moon
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontFamily: theme => theme.logo.fontFamily,
                                    fontSize: 12
                                }}>
                                <Link href="/">Polygon NFT Marketplace</Link>
                            </Typography>
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
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: {
                                xs: 'column',
                                md: 'row',
                            },
                            gap: 1,
                            justifyContent: {
                                xs: 'center',
                                md: 'space-between'
                            },
                            alignItems: {
                                xs: 'center',
                            },
                        }}>
                        <RocketLaunchIcon
                            size={14}
                            fill={grey[500]}
                        />
                        <Typography sx={{ color: grey[500], fontSize: '12px' }}>Copyright © 2022 Pony Powered Limited.</Typography>
                    </Box>
                </Container>
            </Box>
        </div >
    )
}

export default Footer;

