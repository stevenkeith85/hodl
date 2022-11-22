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
                                xs: 4,
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
                                    xs: 4,
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
                                <Link href="/about">about</Link>
                                <Link href="/contact">contact</Link>

                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                }}
                            >
                                <Typography sx={{ fontWeight: 600, marginBottom: 0.5 }}>tokens</Typography>
                                <Link href="/explore">explore</Link>
                                {
                                    address &&
                                    <Link href="/create">create</Link>
                                }
                            </Box>
                        </Box>
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            textAlign="center"
                            gap={1}
                        >
                            <Typography
                                sx={{
                                    fontFamily: theme => theme.logo.fontFamily,
                                    fontSize: theme => theme.logo.fontSize,
                                    color: theme => theme.palette.primary.main
                                }}>
                                Hodl My Moon
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

