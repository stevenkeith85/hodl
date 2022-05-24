import { Stack, Box, Container, Typography } from "@mui/material";
import { grey } from '@mui/material/colors';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Logo } from "./Logo";
import { HodlLink } from "./HodlLink";
import { useContext } from "react";
import { WalletContext } from '../contexts/WalletContext';


const Footer = () => {
    const { address } = useContext(WalletContext);

    return (
    <Box>
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
                    <Stack
                        direction={{
                            xs: 'column-reverse',
                            md: 'row'
                        }}
                        spacing={{
                            xs: 4,
                            md: 12
                        }}
                    >
                        <Stack spacing={0.5}>
                            <Typography sx={{ fontWeight: 800, marginBottom: 0.5 }}>Hodl My Moon</Typography>
                            <HodlLink href="/about">About</HodlLink>
                            <HodlLink href="/contact">Contact</HodlLink>
                        </Stack>
                        <Stack spacing={0.5}>
                            <Typography sx={{ fontWeight: 800, marginBottom: 0.5 }}>Non Fungible Tokens</Typography>
                            { address && <HodlLink href="/create">Create</HodlLink> }
                            <HodlLink href="/">Market</HodlLink>
                        </Stack>
                    </Stack>
                    <Stack>
                            <Logo sx={{ 
                                justifyContent: { xs: "center", md: "right" }
                            }} />
                            <Typography sx={{ fontSize: 18, fontWeight: 500, textAlign: 'right' }}>
                                {/* Mint, Showcase, and Trade NFTs */}
                                NFTs
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
                    color: grey[800]
                }}
            >
                <Stack
                    direction={{
                        xs: 'column-reverse',
                        md: 'row-reverse',
                    }}
                    spacing={{
                        xs: 1,
                    }}
                    sx={{
                        display: 'flex',
                        justifyContent: {
                            xs: 'center',
                            md: 'space-between'
                        },
                        alignItems: {
                            xs: 'center',
                        },
                    }}>
                    <Typography sx={{ fontSize: 13 }}>Copyright © 2022 Pony Powered Limited.</Typography>
                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <LinkedInIcon/>
                        <TwitterIcon/>
                    </Stack>

                </Stack>
            </Container>
        </Box>

    </Box >
)
                }

export default Footer;