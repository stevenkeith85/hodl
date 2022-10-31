import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';


const AppBarLoading = ({ address }) => {
    const [pages] = useState([
        {
            label: 'hodl my moon',
            url: '/',
            icon: <Skeleton variant="circular" animation="wave" width={22} height={22} />,
            publicPage: true
        },
        {
            label: <Skeleton variant="text" animation="wave"><Typography>explore</Typography></Skeleton>,
            url: '/explore',
            icon: <Skeleton variant="circular" animation="wave" width={22} height={22} />,
            publicPage: true
        },
        {
            label: <Skeleton variant="text" animation="wave"><Typography>create</Typography></Skeleton>,
            url: '/create',
            icon: <Skeleton variant="circular" animation="wave" width={22} height={22} />,
            publicPage: false
        },
    ]);

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                    position: 'fixed',
                    zIndex: 1100,
                    top: 0,
                    right: 0,
                    color: 'white',
                    background: 'white',
                    width: '100%',
                    maxWidth: `100vw`,
                    boxShadow: 'none',
                    borderBottom: `1px solid #ddd`
                }}>
                <Container
                    maxWidth="xl"
                    sx={{
                        width: '100%',
                        position: 'relative'
                    }}>
                    <Box sx={{
                        minHeight: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                gap: { xs: 1, md: 4 },
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Box
                                    sx={{
                                        color: theme => theme.palette.primary.main,
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        margin: 0,
                                        padding: 0,
                                        lineHeight: 0,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            margin: 0,
                                            padding: 0,
                                            lineHeight: 0,
                                            width: 44,
                                            height: 44,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {pages[0].icon}
                                    </Box>
                                </Box>
                                {
                                    pages.slice(1).filter(p => p.publicPage || address).map((page, i) => (
                                        <Box key={i}
                                            sx={{
                                                color: theme => theme.palette.primary.main,
                                                cursor: 'pointer',
                                                textDecoration: 'none',
                                                margin: 0,
                                                padding: 0,
                                                lineHeight: 0,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    fontFamily: theme => theme.logo.fontFamily,
                                                    padding: '9px',
                                                    textAlign: 'center',
                                                    display: {
                                                        xs: 'none',
                                                        md: 'block'
                                                    }
                                                }}>{page.label}</Box>
                                            <Box
                                                sx={{
                                                    margin: 0,
                                                    padding: 0,
                                                    lineHeight: 0,
                                                    width: 44,
                                                    height: 44,
                                                    display: {
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        xs: 'flex',
                                                        md: 'none'
                                                    }
                                                }}
                                                color="inherit"
                                            >
                                                {page.icon}
                                            </Box>
                                        </Box>
                                    ))}
                            </Box>
                            <Box
                                sx={{
                                    position: { sm: 'relative' },
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: theme => theme.palette.primary.main,
                                    gap: { xs: 1, md: 3 },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: {
                                            xs: 'none',
                                            md: 'flex',
                                        }
                                    }}
                                >
                                    <Skeleton variant="rounded" width={155} height={36} />,
                                </Box>
                                <Box
                                    sx={{
                                        lineHeight: 0,
                                        display: {
                                            xs: 'block',
                                            md: 'none',
                                        }
                                    }}
                                >
                                    <Skeleton variant="circular" animation="wave" width={22} height={22} sx={{ fontSize: 22, margin: 0, padding: 0, lineHeight: 0 }} />
                                </Box>

                                {/* Notifications button and menu */}
                                <Box
                                    sx={{
                                        margin: 0,
                                        padding: 0,
                                        lineHeight: 0,
                                        width: 44,
                                        height: 44,
                                        display: {
                                            xs: address ? 'flex' : 'none'
                                        }
                                    }}
                                    color="inherit"
                                >
                                    <Box
                                        width={44}
                                        height={44}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center">
                                        <Skeleton variant="rounded" animation="wave" width={22} height={22} sx={{ fontSize: 22, margin: 0, padding: 0, lineHeight: 0 }} />
                                    </Box>
                                </Box>

                                {/* Wallet button and menu */}
                                <Box
                                    sx={{
                                        margin: 0,
                                        padding: 0
                                    }}
                                >
                                    <Box
                                        sx={{ display: !address ? 'flex' : 'none' }}
                                        width={44}
                                        height={44}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center">
                                        <Skeleton variant="rounded" animation="wave" width={22} height={22} />
                                    </Box>
                                    <Box
                                        sx={{ display: address ? 'flex' : 'none' }}
                                        width={44}
                                        height={44}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center">
                                        <Skeleton variant="circular" animation="wave" width={44} height={44} />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Box sx={{
                minHeight: '64px',
                display: 'flex',
                alignItems: 'center',
                position: 'relative'
            }} />
        </>
    );
};

export default AppBarLoading;
