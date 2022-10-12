import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Container from '@mui/material/Container';
import { useState, useContext, useEffect, useRef } from 'react';
import Link from 'next/link';

import { HoverMenu } from '../menu/HoverMenu';
import { AccountBalanceWallet, AddCircle, Explore, RocketLaunch } from '@mui/icons-material';
import { WalletContext } from '../../contexts/WalletContext';
import { HodlNotifications } from '../notifications/HodlNotifications';
import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { SearchBox } from '../Search';
import { UserAvatarAndHandle } from '../avatar/UserAvatarAndHandle';
import { HodlAction } from '../../models/HodlAction';
import { PusherContext } from '../../contexts/PusherContext';

import { useConnect } from '../../hooks/useConnect';
import { SessionExpiredModal } from '../modals/SessionExpiredModal';
import { useRouter } from 'next/router';

const ResponsiveAppBar = ({ showAppBar = true }) => {
    const { address, setSigner } = useContext(WalletContext);
    const { pusher, userSignedInToPusher } = useContext(PusherContext);

    const router = useRouter();
    const [connect, disconnect, disconnectFE] = useConnect();
    const [error, setError] = useState('');

    const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
    const [sessionExpiredModalOpen, setSessionExpiredModalOpen] = useState(false);
    const [showDesktopNotifications, setShowDesktopNotifications] = useState(false);

    const [pages] = useState([
        {
            label: 'hodl my moon',
            url: '/',
            icon: <RocketLaunch sx={{ fontSize: 22, margin: 0, padding: 0, lineHeight: 0 }} />,
            publicPage: true
        },
        {
            label: 'explore',
            url: '/explore',
            icon: <Explore sx={{ fontSize: 22, margin: 0, padding: 0 }} />,
            publicPage: true
        },
        {
            label: 'create',
            url: '/create',
            icon: <AddCircle sx={{ fontSize: 22, margin: 0, padding: 0 }} />,
            publicPage: false
        },
    ]);

    useEffect(() => {
        if (error !== '') {
            enqueueSnackbar(error,
                {
                    // @ts-ignore
                    variant: "hodlsnackbar",
                    type: "error"
                });

            setError('');
        }
    }, [error, enqueueSnackbar]) //  Warning: React Hook useEffect has a missing dependency: 'enqueueSnackbar'. Either include it or remove the dependency array.

    useEffect(() => {
        if (router?.query?.sessionExpired) {
            setSessionExpiredModalOpen(true);
        }
    }, [router?.query]
    )
    useEffect(() => {
        axios.interceptors.response.use(null, async (error) => {
            if (error.config &&
                error.response &&
                error.response.status === 401
                && !error.config.__isRetry) {
                const { refreshed } = error.response.data;

                error.config.__isRetry = true;

                if (refreshed) {
                    return axios.request(error.config);
                }
                else {
                    // The BE is disconnected in the jwt code
                    disconnectFE();

                    // add the query param to display the 'session ended' dialog
                    router.push(window.location.pathname + '?sessionExpired=true');
                }

            } else if (error.config && error.response && error.response.status === 429) {
                const { message } = error.response.data;
                setError(message);
            } else if (error.config && error.response && error.response.status === 500) {
                setError("Something hasn't worked as expected; sorry");
            }

            return Promise.reject(error);
        });
    }, [setSigner]);

    const showPopUpNotification = (action: HodlAction) => {
        enqueueSnackbar(
            "",
            {
                // @ts-ignore
                variant: 'hodlnotification',
                action,
            }
        )
    }

    useEffect(() => {
        console.log('Pusher - setting up notification hover updates');
        console.log('Pusher - pusher / user ', pusher, userSignedInToPusher);

        if (!pusher || !userSignedInToPusher) {
            return;
        }

        pusher.user.bind('notification-hover', showPopUpNotification);

        return () => {
            console.log('Pusher - cleaning up notification hover updates');
            pusher.user.unbind('notification-hover', showPopUpNotification);
        }

    }, [pusher, userSignedInToPusher]);

    if (!showAppBar) {
        return null;
    }

    return (
        <>
            <SessionExpiredModal modalOpen={sessionExpiredModalOpen} setModalOpen={setSessionExpiredModalOpen} />
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
                    <Toolbar
                        disableGutters
                    >
                        <Box sx={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                gap: { xs: 4, md: 6 },
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Link
                                    key={pages[0].url}
                                    href={pages[0].url}
                                    passHref
                                >
                                    <Box
                                        component="a"
                                        sx={{
                                            color: theme => theme.palette.primary.main,
                                            cursor: 'pointer',
                                            textDecoration: 'none',
                                            margin: 0,
                                            padding: 0,
                                            lineHeight: 0,
                                        }}
                                    >
                                        <Typography
                                            component="span"
                                            sx={{
                                                fontFamily: theme => theme.logo.fontFamily,
                                                margin: 0,
                                                padding: 0,
                                                lineHeight: 0,
                                            }}
                                        >{pages[0].icon}</Typography>
                                    </Box>
                                </Link>
                                {
                                    pages.slice(1).filter(p => p.publicPage || address).map((page, i) => (
                                        <Link
                                            key={page.url}
                                            href={page.url}
                                            passHref
                                        >
                                            <Box
                                                component="a"
                                                sx={{
                                                    color: theme => theme.palette.primary.main,
                                                    cursor: 'pointer',
                                                    textDecoration: 'none',
                                                    margin: 0,
                                                    padding: 0,
                                                    lineHeight: 0,
                                                }}
                                            >
                                                <Typography
                                                    component="span"
                                                    sx={{
                                                        fontFamily: theme => theme.logo.fontFamily,
                                                        margin: 0,
                                                        padding: 0,
                                                        lineHeight: 0,
                                                        display: {
                                                            xs: 'none',
                                                            sm: 'block'
                                                        }
                                                    }}>{page.label}</Typography>
                                                <Typography
                                                    component="span"
                                                    sx={{
                                                        fontFamily: theme => theme.logo.fontFamily,
                                                        margin: 0,
                                                        padding: 0,
                                                        lineHeight: 0,
                                                        display: {
                                                            xs: 'block',
                                                            sm: 'none'
                                                        }
                                                    }}>{page.icon}</Typography>
                                            </Box>
                                        </Link>
                                    ))}
                            </Box>
                            <Box
                                sx={{
                                    position: { sm: 'relative' },
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: { xs: 2, md: 3 },
                                }}
                            >

                                <Box
                                    sx={{
                                        display: {
                                            xs: 'none',
                                            sm: 'block'
                                        }
                                    }}
                                >
                                    <SearchBox setHoverMenuOpen={null} />
                                </Box>
                                <HodlNotifications
                                    setHoverMenuOpen={setDesktopMenuOpen}
                                    showNotifications={showDesktopNotifications}
                                    setShowNotifications={setShowDesktopNotifications}
                                />
                                <HoverMenu
                                    hoverMenuOpen={desktopMenuOpen}
                                    setHoverMenuOpen={setDesktopMenuOpen}
                                />
                                <IconButton
                                    size="large"
                                    sx={{
                                        margin: 0,
                                        padding: 0
                                    }}
                                    onClick={e => {
                                        setShowDesktopNotifications(false);
                                        setDesktopMenuOpen(prev => !prev);
                                        e.stopPropagation();
                                    }}
                                    color="inherit"
                                >
                                    {
                                        desktopMenuOpen ?
                                            <Box
                                                width={44}
                                                height={44}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center">
                                                <CloseIcon color="primary" />
                                            </Box> :
                                            address ?
                                                <UserAvatarAndHandle
                                                    address={address}
                                                    withLink={false}
                                                    handle={false}
                                                />
                                                :
                                                <Box
                                                    width={44}
                                                    height={44}
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center">
                                                    <AccountBalanceWallet color="primary" />
                                                </Box>
                                    }
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
export default ResponsiveAppBar;
