import { Stack, Box, Container, Typography } from "@mui/material";
import { grey } from '@mui/material/colors';
import { HodlLink } from "../HodlLink";
import { useContext } from "react";
import { WalletContext } from '../../contexts/WalletContext';


const Footer = ({ showFooter = true }) => {
    const { address } = useContext(WalletContext);

    if (!showFooter) {
        return null;
    }

    return (
        <Box>
            <Box sx={{ backgroundColor: grey[200] }}>
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
                                <Typography sx={{ fontWeight: 600, marginBottom: 0.5 }}>Hodl My Moon</Typography>
                                <HodlLink href="/about">about</HodlLink>
                                <HodlLink href="/contact">contact</HodlLink>
                            </Stack>
                            {address && <Stack spacing={0.5}>
                                <Typography sx={{ fontWeight: 600, marginBottom: 0.5 }}>NFTs</Typography>
                                <HodlLink href="/explore">explore</HodlLink>
                                <HodlLink href="/create">create</HodlLink>
                            </Stack>}
                        </Stack>
                        <Box display="flex" justifyContent="center" alignItems="center" textAlign="center" gap={1}>
                            <Typography
                                sx={{
                                    fontFamily: theme => theme.logo.fontFamily,
                                    fontSize: theme => theme.logo.fontSize
                                }}>
                                Hodl My Moon
                            </Typography>
                        </Box>
                    </Stack>
                </Container>
            </Box>
            <Box sx={{ backgroundColor: grey[300] }}>
                <Container
                    maxWidth="xl"
                    sx={{
                        paddingTop: {
                            xs: 2
                        },
                        paddingBottom: {
                            xs: 2,
                        },
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
                        <Typography sx={{ fontSize: `12px` }}>Copyright © 2022 Pony Powered Limited.</Typography>
                    </Stack>
                </Container>
            </Box>

        </Box >
    )
}

export default Footer;