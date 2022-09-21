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

import { useMediaQuery, useTheme } from '@mui/material';
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

const ResponsiveAppBar = ({ showAppBar = true }) => {
    const { address, setSigner } = useContext(WalletContext);
    const { pusher, userSignedInToPusher } = useContext(PusherContext);

    const [connect, disconnect] = useConnect();
    const [error, setError] = useState('');

    const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
    const [sessionExpiredModalOpen, setSessionExpiredModalOpen] = useState(false);
    const [showDesktopNotifications, setShowDesktopNotifications] = useState(false);

    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    const [pages] = useState([
        {
            label: 'hodl my moon',
            url: '/',
            icon: <RocketLaunch />,
            publicPage: true
        },
        {
            label: 'explore',
            url: '/explore',
            icon: <Explore />,
            publicPage: true
        },
        {
            label: 'create',
            url: '/create',
            icon: <AddCircle />,
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
        axios.interceptors.response.use(null, async (error) => {
            if (error.config && error.response && error.response.status === 401 && !error.config.__isRetry) {
                const { refreshed } = error.response.data;

                error.config.__isRetry = true;

                if (refreshed) {
                    return axios.request(error.config);
                } else {
                    await disconnect();
                    setSessionExpiredModalOpen(true);
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


    const notificationsHover = useRef(false)

    useEffect(() => {
        if (!userSignedInToPusher) {
            console.log('appbar - user not signed in to pusher')
            return;
        }

        console.log('appbar - binding to notification hover')
        
        pusher.user.bind('notification-hover', (action: HodlAction) => {
            enqueueSnackbar(
                "",
                {
                    // @ts-ignore
                    variant: 'hodlnotification',
                    action,
                }
            )
        });

        return () => {
        }

    }, [userSignedInToPusher])

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

                                {pages.filter(p => p.publicPage || address).map((page, i) => (
                                    <Link
                                        key={page.url}
                                        href={page.url}
                                        passHref
                                    >
                                        {/* <Tooltip title={page.label} > */}
                                        <Typography
                                            component="a"
                                            key={page.label}
                                            sx={{
                                                color: theme => theme.palette.primary.main,
                                                margin: 0,
                                                padding: 0,
                                                lineHeight: 0,
                                                fontFamily: theme => theme.logo.fontFamily,
                                                cursor: 'pointer',
                                                // color: 'white',
                                                textTransform: 'none',
                                                textDecoration: 'none',
                                                fontSize: {
                                                    md: 16,
                                                },
                                            }}
                                        >
                                            {i > 0 && !xs ? page.label : page.icon}
                                        </Typography>
                                        {/* </Tooltip> */}
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
                                {!xs && <SearchBox setHoverMenuOpen={null} />}
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
                                                /> :
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
