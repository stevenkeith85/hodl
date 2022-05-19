import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Container from '@mui/material/Container';
import { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { MobileMenu } from './MobileMenu';
import { AccountBalanceWallet, AccountCircle, Spa, Storefront } from '@mui/icons-material';
import { useConnect } from '../hooks/useConnect';
import { WalletContext } from '../contexts/WalletContext';
import { useNickname } from '../hooks/useNickname';
import { NicknameModal } from './modals/NicknameModal';
import { ProfilePictureModal } from './ProfilePictureModal';
import { HodlNotifications } from './HodlNotifications';
import axios from 'axios'
import { useSnackbar } from 'notistack';
import { SearchBox } from './Search';

const ResponsiveAppBar = () => {
    const { address, setAddress, setSigner } = useContext(WalletContext);

    const router = useRouter();
    const [connect] = useConnect();

    const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
    const [profilePictureModalOpen, setProfilePictureModalOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { enqueueSnackbar } = useSnackbar();
    const [error, setError] = useState('');

    const [pages] = useState([
        {
            label: 'Market',
            url: '/',
            icon: <Storefront />,
            publicPage: true
        },
        {
            label: 'Create',
            url: '/mint',
            icon: <Spa />,
            publicPage: false
        },
        {
            label: 'Profile',
            url: `/profile`,
            icon: <AccountCircle />,
            publicPage: false
        },
    ]);

    const [_update, _apiError, _setApiError, nickname] = useNickname()

    useEffect(() => {
        const load = async () => {
            if (localStorage.getItem('jwt')) {
                connect();
            }
        };

        load();
    }, [])

    useEffect(() => {
        if (error !== '') {
            enqueueSnackbar(error, { variant: "error" });
            // @ts-ignore
            setError('');
        }
        // @ts-ignore
    }, [error])

    useEffect(() => {
        axios.interceptors.response.use(null, async (error) => {
            if (error.config && error.response && error.response.status === 401 && !error.config.__isRetry) {
                const { refreshed, accessToken } = error.response.data;

                error.config.__isRetry = true;

                if (refreshed) {
                    localStorage.setItem('jwt', accessToken);

                    error.config.headers.Authorization = accessToken;
                    return axios.request(error.config);
                } else {
                    setSigner(null);
                    setAddress(null);
                    localStorage.removeItem('jwt');

                    // TODO: Modal dialog about the session expiring
                }

            } else if (error.config && error.response && error.response.status === 429) {
                const { message } = error.response.data;
                setError(message);
            }

            return Promise.reject(error);
        });
    }, []);

    return (
        <>
            <NicknameModal nicknameModalOpen={nicknameModalOpen} setNicknameModalOpen={setNicknameModalOpen}></NicknameModal>
            <ProfilePictureModal profilePictureModalOpen={profilePictureModalOpen} setProfilePictureModalOpen={setProfilePictureModalOpen}></ProfilePictureModal>
            <AppBar position="fixed" sx={{ maxWidth: `100vw`, left: 0 }}>
                <Container maxWidth="xl" sx={{ width: '100%', position: 'relative' }}>
                    <Toolbar disableGutters>

                        {/* Mobile */}
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, width: '100%', justifyContent: 'space-between' }}>
                            <MobileMenu
                                pages={pages}
                                mobileMenuOpen={mobileMenuOpen}
                                setMobileMenuOpen={setMobileMenuOpen}
                                nicknameModalOpen={nicknameModalOpen}
                                setNicknameModalOpen={setNicknameModalOpen}
                                profilePictureModalOpen={profilePictureModalOpen}
                                setProfilePictureModalOpen={setProfilePictureModalOpen}
                            />
                            <Logo />
                            <Stack
                                direction="row"
                                // spacing={1}
                                sx={{
                                    position: { sm: 'relative' },
                                    display: { xs: 'flex', md: 'none' },
                                    alignItems: 'center'
                                }}
                            >
                                <HodlNotifications />
                                <IconButton
                                    sx={{ zIndex: 999 }}
                                    size="large"
                                    onClick={(e) => {
                                        console.log('clicked')
                                        setMobileMenuOpen(prev => !prev);
                                        // e.stopPropagation();
                                    }}
                                    color="inherit"
                                >
                                    {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                                </IconButton>
                            </Stack>
                        </Box>


                        {/* Desktop */}
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' },
                            width: '100%',
                            justifyContent: 'space-between'
                        }}>
                            <Stack direction="row" spacing={10} sx={{ alignItems: 'center' }}>
                                <Logo />
                                <Box sx={{
                                    display: 'grid',
                                    gap: 4,
                                    gridTemplateColumns: `repeat(3, minmax(0, 1fr))`,

                                }}>
                                    {pages.filter(p => p.publicPage || address).map(page => (
                                        <Link
                                            key={page.url}
                                            href={page.url === '/profile' ? `${page.url}/${nickname || address}` : page.url}
                                            passHref
                                        >
                                            {router.asPath === page.url ?
                                                <Typography
                                                    key={page.label}
                                                    sx={{
                                                        display: 'block',
                                                        textAlign: 'center',
                                                        padding: 1,
                                                        cursor: 'pointer',
                                                        color: 'white',
                                                        textTransform: 'none',
                                                        fontSize: {
                                                            md: 16,
                                                        },
                                                        fontWeight: 900
                                                    }}
                                                >
                                                    {page.label}
                                                </Typography>
                                                : <Typography
                                                    key={page.label}
                                                    sx={{
                                                        display: 'block',
                                                        textAlign: 'center',
                                                        padding: 1,
                                                        cursor: 'pointer',
                                                        color: 'white',
                                                        textTransform: 'none',
                                                        fontSize: {
                                                            md: 16,
                                                        },
                                                        '&:hover': {
                                                            fontWeight: 900,
                                                        }
                                                    }}
                                                >
                                                    {page.label}
                                                </Typography>
                                            }
                                        </Link>
                                    ))}
                                </Box>
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                    position: { sm: 'relative' },
                                    display: { xs: 'none', md: 'flex' },
                                    alignItems: 'center'
                                }}
                            >
                                <SearchBox closeMenu={undefined} />
                                <HodlNotifications />

                                <MobileMenu
                                    page={1}
                                    showBack={false}
                                    pages={pages}
                                    mobileMenuOpen={mobileMenuOpen}
                                    setMobileMenuOpen={setMobileMenuOpen}
                                    nicknameModalOpen={nicknameModalOpen}
                                    setNicknameModalOpen={setNicknameModalOpen}
                                    profilePictureModalOpen={profilePictureModalOpen}
                                    setProfilePictureModalOpen={setProfilePictureModalOpen}
                                />
                                <IconButton
                                    size="large"
                                    sx={{ margin: 0, padding: 0 }}
                                    onClick={(e) => {
                                        console.log('also clicked')
                                        setMobileMenuOpen(prev => !prev);
                                        // e.stopPropagation();
                                    }}
                                    color="inherit"
                                    aria-label='Account Menu'
                                >
                                    {mobileMenuOpen ? <CloseIcon /> : <AccountBalanceWallet />}
                                </IconButton>
                            </Stack>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Toolbar disableGutters />
        </>
    );
};
export default ResponsiveAppBar;
