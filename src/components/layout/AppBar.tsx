// import * as React from 'react';
import { useState, useContext, useEffect } from 'react';

import axios from 'axios'

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';

import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExploreIcon from '@mui/icons-material/Explore';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SearchIcon from '@mui/icons-material/Search';

import { useRouter } from 'next/router';
import Link from 'next/link';

import { HoverMenu } from '../menu/HoverMenu';

import { WalletContext } from '../../contexts/WalletContext';
import { HodlNotifications } from '../notifications/HodlNotifications';

import { enqueueSnackbar } from 'notistack'
import { SearchBox } from '../Search';

import { ActionTypes, HodlAction } from '../../models/HodlAction';
import { PusherContext } from '../../contexts/PusherContext';

import { useConnect } from '../../hooks/useConnect';
import { SessionExpiredModal } from '../modals/SessionExpiredModal';

import { mutate } from 'swr';
import { MobileSearch } from '../MobileSearch';
import { UserAvatarAndHandle } from '../avatar/UserAvatarAndHandle';


const ResponsiveAppBar = ({ showAppBar = true }) => {
    const { address, setSigner } = useContext(WalletContext);
    const { pusher, userSignedInToPusher } = useContext(PusherContext);

    const router = useRouter();
    const [connect, disconnect, disconnectFE] = useConnect();
    const [error, setError] = useState('');

    const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
    const [sessionExpiredModalOpen, setSessionExpiredModalOpen] = useState(false);
    const [showDesktopNotifications, setShowDesktopNotifications] = useState(false);

    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const [pages] = useState([
        {
            label: 'hodl my moon',
            url: '/',
            icon: <RocketLaunchIcon sx={{ fontSize: 22, margin: 0, padding: 0, lineHeight: 0 }} />,
            publicPage: true
        },
        {
            label: 'explore',
            url: '/explore',
            icon: <ExploreIcon sx={{ fontSize: 22, margin: 0, padding: 0 }} />,
            publicPage: true
        },
        {
            label: 'create',
            url: '/create',
            icon: <AddCircleIcon sx={{ fontSize: 22, margin: 0, padding: 0 }} />,
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

    const mutateUIAndShowPopUpNotification = (action: HodlAction) => {
        if (action.action === ActionTypes.Bought ||
            action.action === ActionTypes.Listed ||
            action.action === ActionTypes.Delisted) {
            mutate([`/api/contracts/mutable-token`, action.objectId]);
        }

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

        pusher.user.bind('notification-hover', mutateUIAndShowPopUpNotification);

        return () => {
            console.log('Pusher - cleaning up notification hover updates');
            pusher.user.unbind('notification-hover', mutateUIAndShowPopUpNotification);
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
                                gap: { xs: 1, md: 4 },
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
                                        </Link>
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
                                            md: 'block'
                                        }
                                    }}
                                >
                                    <SearchBox setHoverMenuOpen={null} />
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
                                    {mobileSearchOpen ?
                                        <IconButton
                                            sx={{
                                                margin: 0,
                                                padding: 0,
                                                lineHeight: 0,
                                                width: 44,
                                                height: 44
                                            }}
                                            color="inherit"
                                            onClick={() => setMobileSearchOpen(false)}
                                        >
                                            <CloseIcon sx={{
                                                lineHeight: 0,
                                                fontSize: 22
                                            }}
                                            />
                                        </IconButton>
                                        :
                                        <IconButton
                                            sx={{
                                                margin: 0,
                                                padding: 0,
                                                lineHeight: 0,
                                                width: 44,
                                                height: 44
                                            }}
                                            color="inherit"
                                            onClick={
                                                () => {
                                                    setMobileSearchOpen(true);
                                                    setShowDesktopNotifications(false);
                                                }}
                                        >
                                            <SearchIcon sx={{
                                                lineHeight: 0,
                                                fontSize: 22
                                            }}
                                            />
                                        </IconButton>
                                    }
                                </Box>
                                <HodlNotifications
                                    setHoverMenuOpen={setDesktopMenuOpen}
                                    showNotifications={showDesktopNotifications}
                                    setShowNotifications={setShowDesktopNotifications}
                                    setMobileSearchOpen={setMobileSearchOpen}
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
                                        setMobileSearchOpen(false);
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
                                                    <AccountBalanceWalletIcon color="primary" />
                                                </Box>
                                    }
                                </IconButton>
                            </Box>
                        </Box>
                    </Toolbar>
                </Container>
                {mobileSearchOpen && <MobileSearch mobileSearchOpen={mobileSearchOpen} setMobileSearchOpen={setMobileSearchOpen} />}
            </AppBar>
            <Toolbar disableGutters />
        </>
    );
};
export default ResponsiveAppBar;
