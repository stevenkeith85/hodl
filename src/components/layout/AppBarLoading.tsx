import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { UserAvatarAndHandleBodyLoading } from '../avatar/UserAvatarAndHandleBodyLoading';
import Link from '@mui/material/Link';


const AppBarLoading = ({ address }) => {
    const [pages] = useState([
        {
            label: 'hodl my moon',
            url: '/',
            icon: <img src="https://res.cloudinary.com/dyobirj7r/image/upload/w_80,h_80/static/logo.png" width={40} height={40}/>,
            publicPage: true
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
                                        <Link key={pages[0].url} href={pages[0].url}>
                                            {pages[0].icon}
                                        </Link>
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
                                                }}>
                                                <Link sx={{ textDecoration: 'none' }} key={page.url} href={page.url}>
                                                    {page.label}
                                                </Link>
                                            </Box>
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
                                                <Link key={page.url} href={page.url}>
                                                    {page.icon}
                                                </Link>
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
                                    gap: { xs: 1 },
                                }}
                            >
                                {/* Search box desktop */}
                                <Box
                                    sx={{
                                        display: {
                                            xs: 'none',
                                            md: 'flex',
                                        }
                                    }}
                                >
                                    <Skeleton variant="rounded" width={157} height={36} />
                                </Box>
                                {/* Search box mobile */}
                                <Box
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        display: {
                                            xs: 'flex',
                                            md: 'none',

                                        }
                                    }}
                                >
                                    <Skeleton variant="circular" animation="wave" width={22} height={22} />
                                </Box>

                                {/* Notifications button and menu */}
                                <Box
                                    sx={{
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
                                        <Skeleton variant="rounded" animation="wave" width={22} height={22} />
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
                                        width={44}
                                        height={44}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center">
                                        <Skeleton variant="rounded" animation="wave" width={22} height={22} />
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
