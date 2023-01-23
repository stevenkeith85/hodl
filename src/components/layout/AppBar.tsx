import {
    useState,
    useEffect,
    useContext
} from 'react';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import { PusherContext } from '../../contexts/PusherContext';
import { useConnect } from '../../hooks/useConnect';
import { WalletContext } from '../../contexts/WalletContext';
import { SignedInContext } from '../../contexts/SignedInContext';

const SignInDialog = dynamic(
    () => import('../menu/SignInDialog').then(mod => mod.SignInDialog),
    {
        ssr: false,
        loading: () => null
    }
);

const CloseIcon = dynamic(
    () => import('../icons/CloseIcon').then(mod => mod.CloseIcon),
    {
        ssr: false,
        loading: () => null
    }
);

const SearchBox = dynamic(
    () => import('../SearchBox').then(mod => mod.SearchBox),
    {
        ssr: true,
        loading: () => null
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
        ssr: true,
        loading: () => null
    }
);

const MenuIcon = dynamic(
    () => import('@mui/icons-material/Menu'),
    {
        ssr: true,
        loading: () => null
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
        ssr: true,
        loading: () => null
    }
);

const SessionExpiredModal = dynamic(
    () => import('../modals/SessionExpiredModal').then(mod => mod.SessionExpiredModal),
    {
        ssr: false,
        loading: () => null
    }
);

const AppBar = ({ address }) => {
    const theme = useTheme();

    const [error, setError] = useState('');

    const [hoverMenuOpen, setHoverMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [signInModalOpen, setSignInModalOpen] = useState(false);

    const { pusher } = useContext(PusherContext);
    const { walletAddress } = useContext(WalletContext);
    const { signedInAddress } = useContext(SignedInContext);

    const connect = useConnect();

    const homepage = {
        label: 'hodl my moon',
        url: '/',
        icon: <img src="https://res.cloudinary.com/dyobirj7r/image/upload/w_70,h_70/static/logo.png" width={35} height={35} />,
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
        if (!address) {
            return;
        }

        const setUpAxios = async () => {
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
                    // TODO: We should maybe just write this to the console
                    console.log("Something hasn't worked as expected; sorry");
                }

                return Promise.reject(error);
            });
        }
        setUpAxios();
        connect(false);
    }, [address]);

    useEffect(() => {
        // if the user isn't signed in to the BE, they will need to sign a message
        // also; if they switch wallets outside the app. (vie metamask ui or something) then we will make them sign in again
        if (walletAddress && !signedInAddress ||
            (walletAddress && signedInAddress && walletAddress !== signedInAddress)) {
            setSignInModalOpen(true);
        }
    }, [walletAddress, signedInAddress]);

    return (
        <>
            {
                signInModalOpen && <SignInDialog
                    setSignInModalOpen={setSignInModalOpen}
                    signInModalOpen={signInModalOpen}
                />
            }
            {
                sessionExpired &&
                <SessionExpiredModal modalOpen={sessionExpired} setModalOpen={setSessionExpired} />
            }
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
                    borderBottom: `1px solid #eee`
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
                                gap: 6,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>

                                <Link
                                    key={homepage.url}
                                    href={homepage.url}
                                >
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
                                <Box sx={{
                                    display: {
                                        xs: 'none',
                                        md: 'flex'
                                    },
                                    fontSize: 14,
                                    a: {
                                        color: theme => theme.palette.text.secondary,
                                        textDecoration: 'none'
                                    },
                                    
                                    gap: 6
                                }}>
                                    <Link href="/explore">
                                        Explore
                                    </Link>
                                    <Link href="/learn">
                                        Learn
                                    </Link>
                                </Box>
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
                                <Box sx={{
                                    display: {
                                        xs: 'none',
                                        md: 'flex'
                                    }
                                }}>
                                    <SearchBox />
                                </Box>
                                <Box sx={{
                                    display: {
                                        xs: 'flex',
                                        md: 'none'
                                    }
                                }}>
                                    <MobileSearchIcon
                                        mobileSearchOpen={mobileSearchOpen}
                                        setMobileSearchOpen={setMobileSearchOpen}
                                        setShowNotifications={setShowNotifications}
                                    />
                                </Box>
                                {
                                    address &&
                                    <NotificationsButtonAndMenu
                                        setHoverMenuOpen={setHoverMenuOpen}
                                        setMobileSearchOpen={setMobileSearchOpen}
                                        setShowNotifications={setShowNotifications}
                                        showNotifications={showNotifications}
                                    />
                                }
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
                                {
                                    hoverMenuOpen &&
                                    <HoverMenu hoverMenuOpen={hoverMenuOpen} setHoverMenuOpen={setHoverMenuOpen} />
                                }
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

export default AppBar;
