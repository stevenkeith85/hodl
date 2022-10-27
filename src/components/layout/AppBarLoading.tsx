import { useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';


const AppBarLoading = ({ address }) => {
    const [pages] = useState([
        {
            label: 'hodl my moon',
            url: '/',
            icon: <Skeleton variant="circular" animation="wave" width={22} height={22} sx={{ fontSize: 22, margin: 0, padding: 0, lineHeight: 0 }} />,
            publicPage: true
        },
        {
            label: <Skeleton variant="text" animation="wave"><Typography>explore</Typography></Skeleton>,
            url: '/explore',
            icon: <Skeleton variant="circular" animation="wave" width={22} height={22} sx={{ fontSize: 22, margin: 0, padding: 0, lineHeight: 0 }} />,
            publicPage: true
        },
        {
            label: <Skeleton variant="text" animation="wave"><Typography>create</Typography></Skeleton>,
            url: '/create',
            icon: <Skeleton variant="circular" animation="wave" width={22} height={22} sx={{ fontSize: 22, margin: 0, padding: 0, lineHeight: 0 }} />,
            publicPage: false
        },
    ]);

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    background: 'white',
                    maxWidth: `100vw`,
                    left: 0,
                    boxShadow: 'none',
                    borderBottom: `1px solid #ddd`
                }}>
                <Container
                    maxWidth="xl"
                    sx={{
                        width: '100%',
                        position: 'relative'
                    }}>
                    <Toolbar disableGutters>
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
                                    <IconButton
                                        sx={{
                                            margin: 0,
                                            padding: 0,
                                            lineHeight: 0,
                                            width: 44,
                                            height: 44
                                        }}
                                        color="inherit"
                                    >
                                        {pages[0].icon}
                                    </IconButton>
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
                                            <Button
                                                variant="text"
                                                color="inherit"
                                                component="span"
                                                sx={{
                                                    fontFamily: theme => theme.logo.fontFamily,
                                                    padding: '9px',
                                                    textAlign: 'center',
                                                    display: {
                                                        xs: 'none',
                                                        md: 'block'
                                                    }
                                                }}>{page.label}</Button>
                                            <IconButton
                                                sx={{
                                                    margin: 0,
                                                    padding: 0,
                                                    lineHeight: 0,
                                                    width: 44,
                                                    height: 44,
                                                    display: {
                                                        xs: 'block',
                                                        md: 'none'
                                                    }
                                                }}
                                                color="inherit"
                                            >
                                                {page.icon}
                                            </IconButton>
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
                                    <Skeleton variant="rounded" width={160} height={36} />,
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
                                <IconButton
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
                                </IconButton>

                                {/* Wallet button and menu */}
                                <IconButton
                                    size="large"
                                    sx={{
                                        margin: 0,
                                        padding: 0
                                    }}
                                    color="inherit"
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
                                </IconButton>
                            </Box>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Toolbar disableGutters />
        </>
    );
};

export default AppBarLoading;
