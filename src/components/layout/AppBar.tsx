import { useState, useEffect, useContext } from 'react';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { PusherContext } from '../../contexts/PusherContext';


const CloseIcon = dynamic(
    () => import('../icons/CloseIcon').then(mod => mod.CloseIcon),
    {
        ssr: false,
        loading: () => null
    }
);

const SearchBox = dynamic(
    () => import('../Search').then(mod => mod.SearchBox),
    {
        ssr: false,
        loading: () => <p style={{ width: 157, height: 36 }} />
    }
);

const HoverMenu = dynamic(
    () => import('./../menu/HoverMenu').then(mod => mod.HoverMenu),
    {
        ssr: false,
        loading: () => null
    }
);

const MobileSearchIcon = dynamic(
    () => import('./MobileSearchIcon').then(mod => mod.MobileSearchIcon),
    {
        ssr: false,
        loading: () => null
    }
);

const MenuIcon = dynamic(
    () => import('@mui/icons-material/Menu'),
    {
        ssr: false,
        loading: () => <p style={{ width: 40, height: 40 }}></p>
    }
);

const MobileSearch = dynamic(
    () => import('../MobileSearch').then(mod => mod.MobileSearch),
    {
        ssr: false,
        loading: () => null
    }
);

const NotificationsButtonAndMenu = dynamic(
    () => import('./NotificationsButtonAndMenu').then(mod => mod.NotificationsButtonAndMenu),
    {
        ssr: false,
        loading: () => <p style={{ width: 40, height: 40 }}></p>
    }
);

const SessionExpiredModal = dynamic(
    () => import('../modals/SessionExpiredModal').then(mod => mod.SessionExpiredModal),
    {
        ssr: false,
        loading: () => null
    }
);

const ResponsiveAppBar = ({ address }) => {
    const theme = useTheme();

    const [error, setError] = useState('');

    const [hoverMenuOpen, setHoverMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const mdUp = useMediaQuery(theme.breakpoints.up('md'));
    const mdDown = useMediaQuery(theme.breakpoints.down('md'));

    const { pusher } = useContext(PusherContext);

    const homepage = {
        label: 'hodl my moon',
        url: '/',
        icon: <img src="https://res.cloudinary.com/dyobirj7r/image/upload/w_70,h_70/static/logo.png" width={35} height={35} />,
        publicPage: true
    };

    useEffect(() => {

        const displayError = async () => {
            const enqueueSnackbar = await import('notistack').then(mod => mod.enqueueSnackbar);

            if (!error) {
                return;
            }

            enqueueSnackbar(error, {
                variant: "error",
                hideIconVariant: true
            });

            setError('');
        }

        displayError().catch(console.error)

    }, [error]);


    useEffect(() => {
        const setUpAxios = async () => {
            if (!address) {
                return;
            }

            const { default: axios } = await import('axios');

            axios.interceptors.response.use(null, async (error) => {
                if (error.config && error.response && error.response.status === 401 && !error.config.__isRetry) {
                    const { refreshed } = error.response.data;

                    error.config.__isRetry = true;

                    if (refreshed) {
                        return axios.request(error.config);
                    }
                    else {
                        setSessionExpired(true);
                        pusher?.disconnect();
                    }
                } else if (error.config && error.response && error.response.status === 429) {
                    const { message } = error.response.data;
                    setError(message);
                } else if (error.config && error.response && error.response.status === 500) {
                    setError("Something hasn't worked as expected; sorry");
                }

                return Promise.reject(error);
            });
        }

        setUpAxios();
    }, [address]);

    return (
        <>
            {sessionExpired && <SessionExpiredModal modalOpen={sessionExpired} setModalOpen={setSessionExpired} />}
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

                                <Link key={homepage.url} href={homepage.url}>
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
                                                width: 40,
                                                height: 40,
                                                textAlign: 'center'
                                            }}
                                            color="inherit"
                                        >
                                            {homepage.icon}
                                        </IconButton>
                                    </Box>
                                </Link>
                            </Box>
                            <Box
                                sx={{
                                    position: { sm: 'relative' },
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: theme => theme.palette.primary.main,
                                    gap: { xs: 1, md: 2 },
                                }}
                            >
                                {mdUp && <Box><SearchBox /></Box>}
                                {mdDown && <MobileSearchIcon
                                    mobileSearchOpen={mobileSearchOpen}
                                    setMobileSearchOpen={setMobileSearchOpen}
                                    setShowNotifications={setShowNotifications}
                                />
                                }
                                {address &&
                                    <NotificationsButtonAndMenu
                                        setHoverMenuOpen={setHoverMenuOpen}
                                        setMobileSearchOpen={setMobileSearchOpen}
                                        setShowNotifications={setShowNotifications}
                                        showNotifications={showNotifications}
                                    />}

                                {/* menu */}
                                <IconButton
                                    size="large"
                                    sx={{
                                        margin: 0,
                                        padding: 0
                                    }}
                                    onClick={e => {
                                        setShowNotifications(false);
                                        setMobileSearchOpen(false);
                                        setHoverMenuOpen(prev => !prev);
                                        e.stopPropagation();
                                    }}
                                    color="inherit"
                                >
                                    <Box
                                        sx={{
                                            display: hoverMenuOpen ? 'flex' : 'none'
                                        }}
                                        width={40}
                                        height={40}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center">
                                        <CloseIcon size={22} fill={theme.palette.primary.main} />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: hoverMenuOpen ? 'none' : 'flex'
                                        }}
                                        width={40}
                                        height={40}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center">
                                        <MenuIcon sx={{ fontSize: 22 }} />
                                    </Box>
                                </IconButton>
                                {hoverMenuOpen && <HoverMenu hoverMenuOpen={hoverMenuOpen} setHoverMenuOpen={setHoverMenuOpen} />}
                            </Box>
                        </Box>
                    </Box>
                </Container>
                {
                    mobileSearchOpen && <MobileSearch mobileSearchOpen={mobileSearchOpen} setMobileSearchOpen={setMobileSearchOpen} />
                }
            </Box >
            <Box sx={{
                minHeight: '64px',
                display: 'flex',
                alignItems: 'center',
                position: 'relative'
            }} />
        </>
    );
};

export default ResponsiveAppBar;
