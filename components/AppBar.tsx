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

import { Stack, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { HoverMenu } from './HoverMenu';
import { AccountBalanceWallet, Spa, Storefront } from '@mui/icons-material';
import { useConnect } from '../hooks/useConnect';
import { WalletContext } from '../contexts/WalletContext';
import { useNickname } from '../hooks/useNickname';
import { HodlNotifications } from './HodlNotifications';
import axios from 'axios'
import { useSnackbar } from 'notistack';
import { SearchBox } from './Search';
import { ProfileAvatar } from './ProfileAvatar';

const ResponsiveAppBar = () => {
    const { address, setAddress, setSigner } = useContext(WalletContext);

    const router = useRouter();
    const [connect] = useConnect();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);

    const [showMobileNotifications, setShowMobileNotifications] = useState(false);
    const [showDesktopNotifications, setShowDesktopNotifications] = useState(false);

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
            url: '/create',
            icon: <Spa />,
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
            <AppBar position="fixed" sx={{ maxWidth: `100vw`, left: 0 }}>
                <Container maxWidth="xl" sx={{ width: '100%', position: 'relative' }}>
                    <Toolbar disableGutters>
                        {/* Mobile */}
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, width: '100%', justifyContent: 'space-between' }}>
                            <HoverMenu
                                page={0}
                                pages={pages}
                                hoverMenuOpen={mobileMenuOpen}
                                setHoverMenuOpen={setMobileMenuOpen}
                            />
                            <Logo />
                            <Stack
                                direction="row"
                                sx={{
                                    position: { sm: 'relative' },
                                    display: { xs: 'flex', md: 'none' },
                                    alignItems: 'center'
                                }}
                            >
                                <HodlNotifications
                                    setHoverMenuOpen={setMobileMenuOpen}
                                    showNotifications={showMobileNotifications}
                                    setShowNotifications={setShowMobileNotifications}
                                />
                                <IconButton
                                    sx={{ zIndex: 999 }}
                                    size="large"
                                    onClick={e => {
                                        setShowMobileNotifications(false);
                                        setMobileMenuOpen(prev => !prev);
                                        e.stopPropagation();
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
                            <Stack direction="row" spacing={8} sx={{ alignItems: 'center' }}>
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
                                                        // display: 'block',
                                                        // textAlign: 'center',
                                                        // padding: 1,
                                                        fontFamily: theme => theme.logo.fontFamily,
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
                                                        // display: 'block',
                                                        // textAlign: 'center',
                                                        // padding: 1,
                                                        fontFamily: theme => theme.logo.fontFamily,
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
                                <SearchBox setHoverMenuOpen={null} />
                                <HodlNotifications
                                    setHoverMenuOpen={setDesktopMenuOpen}
                                    showNotifications={showDesktopNotifications}
                                    setShowNotifications={setShowDesktopNotifications}
                                />
                                <HoverMenu
                                    page={1}
                                    pages={pages}
                                    hoverMenuOpen={desktopMenuOpen}
                                    setHoverMenuOpen={setDesktopMenuOpen}
                                />
                                <IconButton
                                    size="large"
                                    sx={{ margin: 0, padding: 0 }}
                                    onClick={e => {
                                        setShowDesktopNotifications(false);
                                        setDesktopMenuOpen(prev => !prev);
                                        e.stopPropagation();
                                    }}
                                    color="inherit"
                                    aria-label='Account Menu'
                                >
                                    {
                                        desktopMenuOpen ?
                                            <Box width={36} display="flex" alignItems="center" justifyContent="center"><CloseIcon /></Box> :
                                            address ?
                                                <ProfileAvatar profileAddress={address} size="small" showNickname={false} withLink={false} /> :
                                                <Box width={36} display="flex" alignItems="center" justifyContent="center"><AccountBalanceWallet /></Box>
                                    }
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
