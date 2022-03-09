import { Stack, Box, Container, Typography } from "@mui/material";
import { grey } from '@mui/material/colors';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Logo } from "./Logo";
import Link from "next/link";


const Footer = () => (
    <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
    }}>
        <Box sx={{ backgroundColor: grey[300] }}>
            <Container maxWidth="xl" sx={{
                paddingTop: {
                    xs: 4,
                },
                paddingBottom: {
                    xs: 4,
                },
            }}>
                <Stack
                    direction={{ xs: 'column-reverse', md: 'row' }}
                    spacing={{
                        xs: 4,
                        md: 10
                    }}
                    sx={{
                        display: 'flex',
                        // alignContent: {
                        //     xs: 'center',
                        //   //  md: 'left',
                        // },
                        justifyContent: {
                            // xs: 'center',
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
                    <Stack
                        direction={{
                            xs: 'column-reverse',
                            md: 'row'
                        }}
                        spacing={{
                            xs: 4,
                            // sm: 8, 
                            // md: 10 
                        }}
                    >
                        <Stack spacing={1}>
                            <Typography sx={{ fontWeight: 800 }}>Hodl My Moon</Typography>
                            <Link href="/about"><Typography component="a" sx={{ fontSize: 14 }}>About</Typography></Link>
                            <Link href="/contact"><Typography component="a" sx={{ fontSize: 14 }}>Contact</Typography></Link>
                        </Stack>
                        <Stack spacing={1}>
                            <Typography sx={{ fontWeight: 800 }}>Non Fungible Tokens</Typography>
                            <Typography sx={{ fontSize: 14 }}>Mint NFT</Typography>
                            <Typography sx={{ fontSize: 14 }}>My NFT Collection</Typography>
                            <Typography sx={{ fontSize: 14 }}>NFT Market</Typography>
                        </Stack>
                    </Stack>
                    <Stack spacing={2}>
                        <Logo />
                        <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
                            Mint, Showcase, and Profit with NFTS.
                        </Typography>
                    </Stack>
                </Stack>
            </Container>
        </Box>
        <Box sx={{ backgroundColor: grey[200] }}>
            <Container
                maxWidth="xl"
                sx={{
                    paddingTop: {
                        xs: 2
                    },
                    paddingBottom: {
                        xs: 2,
                    },
                    color: grey[600]
                }}
            >
                <Stack
                    direction={{
                        xs: 'column-reverse',
                        md: 'row',
                    }}
                    spacing={{
                        xs: 2,
                        // sm: 4,
                    }}
                    sx={{
                        display: 'flex',
                        justifyContent: {
                            xs: 'center',
                            md: 'space-between'
                        },
                        alignItems: {
                            xs: 'center',
                            md: 'start'
                        },
                    }}>
                    <Typography sx={{ fontSize: 14 }}>Copyright © 2022 Pony Powered Limited.</Typography>
                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <LinkedInIcon />
                        <TwitterIcon />
                    </Stack>

                </Stack>
            </Container>
        </Box>

    </Box>
)

export default Footer;