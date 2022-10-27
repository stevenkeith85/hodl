import { useState, useEffect } from 'react';

import Link from 'next/link';
import dynamic from 'next/dynamic';

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';

import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExploreIcon from '@mui/icons-material/Explore';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';

import axios from 'axios'
import useSWR, { mutate } from 'swr';
import { enqueueSnackbar } from 'notistack'

import { SearchBox } from '../Search';
import { ActionTypes, HodlAction } from '../../models/HodlAction';


const HoverMenu = dynamic(
    () => import('./../menu/HoverMenu').then(mod => mod.HoverMenu),
    {
        loading: () => <div>...</div>
    }
);

const MobileSearch = dynamic(
    () => import('../MobileSearch').then(mod => mod.MobileSearch),
    {
        loading: () => <div>...</div>
    }
);

const HodlNotifications = dynamic(
    () => import('../notifications/HodlNotifications').then(mod => mod.HodlNotifications),
    {
        loading: () => <div>...</div>
    }
);

import { SessionExpiredModal } from '../modals/SessionExpiredModal';
import { UserAvatarAndHandle } from '../avatar/UserAvatarAndHandle';

// const SessionExpiredModal = dynamic(
//     () => import('../modals/SessionExpiredModal').then(mod => mod.SessionExpiredModal),
//     {
//         loading: () => <div>...</div>
//     }
// );

// const UserAvatarAndHandle = dynamic(
//     () => import('../avatar/UserAvatarAndHandle').then(mod => mod.UserAvatarAndHandle),
//     {
//         ssr: false,
//         loading: () => <Skeleton variant='circular' width={44} height={44} animation="wave" />
//     }
// );


const ResponsiveAppBar = ({ address, pusher, userSignedInToPusher }) => {
    const [error, setError] = useState('');
    const [hoverMenuOpen, setHoverMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);
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
        if (!error) {
            return;
        }

        enqueueSnackbar(error,
            {
                // @ts-ignore
                variant: "hodlsnackbar",
                type: "error"
            });

        setError('');
    }, [error]);


    useEffect(() => {
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
    }, [address]);


    const mutateAndNotify = (action: HodlAction) => {
        if (action.action === ActionTypes.Bought ||
            action.action === ActionTypes.Listed ||
            action.action === ActionTypes.Delisted) {
            mutate([`/api/contracts/mutable-token`, action.objectId]);
        }

        enqueueSnackbar("", {
            // @ts-ignore
            variant: 'hodlnotification',
            // @ts-ignore
            hodlAction: action,
        }
        )
    }

    const ringNotificationBell = () => mutateUnread(true, { revalidate: false });

    useEffect(() => {
        if (!pusher || !userSignedInToPusher) {
            return;
        }

        pusher.user.bind('notification-hover', mutateAndNotify);
        pusher.user.bind('notification', ringNotificationBell);

        return () => {
            pusher.user.unbind('notification-hover', mutateAndNotify);
            pusher.user.unbind('notification', ringNotificationBell);
        }

    }, [pusher, userSignedInToPusher]);


    const { data: unread, mutate: mutateUnread } = useSWR(address ? ['/api/notifications', address] : null,
        (url, address) => axios.get(url).then(r => Boolean(r.data.unread))
    );

    return (
        <>
            <SessionExpiredModal modalOpen={sessionExpired} setModalOpen={setSessionExpired} />
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
                                <Link
                                    key={pages[0].url}
                                    href={pages[0].url}
                                    passHref
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
                                        <Link key={page.url} href={page.url}>
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
                                    <SearchBox />
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
                                                    setShowNotifications(false);
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
                                    {showNotifications ? <CloseIcon color="primary" /> :
                                        (unread ?
                                            <NotificationsIcon
                                                color="primary"
                                                sx={{
                                                    fontSize: 22,
                                                    cursor: 'pointer',
                                                    animation: `shake 0.75s`,
                                                    animationDelay: '1s',
                                                    animationTimingFunction: 'ease-in'
                                                }}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setHoverMenuOpen(false);
                                                    setMobileSearchOpen(false);
                                                    setShowNotifications(true);

                                                    mutateUnread(false, { revalidate: false });
                                                }
                                                } /> :
                                            <NotificationsNoneIcon
                                                color="primary"
                                                sx={{
                                                    fontSize: 22,
                                                    cursor: 'pointer',
                                                }}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setHoverMenuOpen(false);
                                                    setMobileSearchOpen(false);
                                                    setShowNotifications(true);

                                                    mutateUnread(false, { revalidate: false });
                                                }}
                                            />)
                                    }
                                </IconButton>

                                <HodlNotifications
                                    showNotifications={showNotifications}
                                    setShowNotifications={setShowNotifications}
                                />

                                {/* Wallet button and menu */}
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
                                        width={44}
                                        height={44}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center">
                                        <CloseIcon color="primary" />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: !hoverMenuOpen && address ? 'flex' : 'none'
                                        }} >
                                        <UserAvatarAndHandle
                                            address={address}
                                            withLink={false}
                                            handle={false}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: !hoverMenuOpen && !address ? 'flex' : 'none'
                                        }}
                                        width={44}
                                        height={44}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center">
                                        <AccountBalanceWalletIcon color="primary" />
                                    </Box>
                                </IconButton>
                                <HoverMenu
                                    hoverMenuOpen={hoverMenuOpen}
                                    setHoverMenuOpen={setHoverMenuOpen}
                                />
                            </Box>
                        </Box>
                    </Toolbar>
                </Container>
                {
                    mobileSearchOpen &&
                    <MobileSearch
                        mobileSearchOpen={mobileSearchOpen}
                        setMobileSearchOpen={setMobileSearchOpen}
                    />
                }
            </AppBar>
            <Toolbar disableGutters />
        </>
    );
};

// const ResponsiveAppBar = ({  }) => {
//     return <h1>Appbar</h1>
// }
export default ResponsiveAppBar;
