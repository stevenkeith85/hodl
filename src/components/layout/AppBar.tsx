import { useState, useEffect } from 'react';

import Link from 'next/link';
import dynamic from 'next/dynamic';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';


import axios from 'axios'
import useSWR, { mutate } from 'swr';
import { enqueueSnackbar } from 'notistack'

import { SearchBox } from '../Search';
import { ActionTypes, HodlAction } from '../../models/HodlAction';


const HoverMenu = dynamic(
    () => import('./../menu/HoverMenu').then(mod => mod.HoverMenu),
    {
        ssr: false,
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

const HodlNotifications = dynamic(
    () => import('../notifications/HodlNotifications').then(mod => mod.HodlNotifications),
    {
        ssr: false,
        loading: () => null
    }
);

import { SessionExpiredModal } from '../modals/SessionExpiredModal';
import { UserAvatarAndHandle } from '../avatar/UserAvatarAndHandle';

import { RocketLaunchIcon } from '../icons/RocketLaunchIcon';
import { useTheme } from '@mui/material/styles';
import { ExploreIcon } from '../icons/ExploreIcon';
import { AddCircleIcon } from '../icons/AddCircleIcon';
import { CloseIcon } from '../icons/CloseIcon';
import { AccountBalanceWalletIcon } from '../icons/AccountBalanceWalletIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { NotificationsIcon } from '../icons/NotificationsIcon';
import { NotificationsNoneIcon } from '../icons/NotificationsNoneIcon';


const ResponsiveAppBar = ({ address, pusher, userSignedInToPusher }) => {
    const [error, setError] = useState('');
    const [hoverMenuOpen, setHoverMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);

    const theme = useTheme();

    const [pages] = useState([
        {
            label: 'hodl my moon',
            url: '/',
            icon: <RocketLaunchIcon size={22} fill={theme.palette.primary.main} />,
            publicPage: true
        },
        {
            label: 'explore',
            url: '/explore',
            icon: <ExploreIcon size={22} fill={theme.palette.primary.main} />,
            publicPage: true
        },
        {
            label: 'create',
            url: '/create',
            icon: <AddCircleIcon size={22} fill={theme.palette.primary.main} />,
            publicPage: false
        },
    ]);


    useEffect(() => {
        if (!error) {
            return;
        }

        enqueueSnackbar(error, { 
            variant: "error",
            hideIconVariant: true
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
                                <Link
                                    key={pages[0].url}
                                    href={pages[0].url}
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
                                                height: 44,
                                                textAlign: 'center'
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
                                                            md: 'flex'
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
                                                            xs: 'flex',
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
                                            md: 'flex'
                                        }
                                    }}
                                >
                                    <SearchBox />
                                </Box>
                                <Box
                                    sx={{
                                        lineHeight: 0,
                                        display: {
                                            xs: 'flex',
                                            md: 'none',
                                        }
                                    }}
                                >
                                    {mobileSearchOpen ?
                                        <IconButton
                                            sx={{
                                                width: 44,
                                                height: 44
                                            }}
                                            color="inherit"
                                            onClick={() => setMobileSearchOpen(false)}
                                        >
                                            <CloseIcon size={22} fill={theme.palette.primary.main} />
                                        </IconButton>
                                        :
                                        <IconButton
                                            sx={{
                                                width: 44,
                                                height: 44,
                                            }}
                                            color="inherit"
                                            onClick={
                                                () => {
                                                    setMobileSearchOpen(true);
                                                    setShowNotifications(false);
                                                }}
                                        >
                                            <SearchIcon size={22} fill={theme.palette.primary.main} />
                                        </IconButton>
                                    }
                                </Box>

                                {/* Notifications button and menu */}
                                {/* <IconButton
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
                                > */}
                                {showNotifications ?
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
                                        <CloseIcon size={22} fill={theme.palette.primary.main} />
                                    </IconButton> :
                                    (unread ?
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

                                            onClick={e => {
                                                e.stopPropagation();
                                                setHoverMenuOpen(false);
                                                setMobileSearchOpen(false);
                                                setShowNotifications(true);

                                                mutateUnread(false, { revalidate: false });
                                            }}
                                        >
                                            <div style={{
                                                cursor: 'pointer',
                                                animation: `shake 0.75s`,
                                                animationDelay: '1s',
                                                animationTimingFunction: 'ease-in'
                                            }}>
                                                <NotificationsIcon
                                                    size={22}
                                                    fill={theme.palette.primary.main}
                                                />
                                            </div>
                                        </IconButton> :
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
                                            onClick={e => {
                                                e.stopPropagation();
                                                setHoverMenuOpen(false);
                                                setMobileSearchOpen(false);
                                                setShowNotifications(true);

                                                mutateUnread(false, { revalidate: false });
                                            }}
                                        >
                                            <NotificationsNoneIcon
                                                fill={theme.palette.primary.main}
                                                size={22}
                                            />
                                        </IconButton>
                                    )
                                }
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
                                        <CloseIcon size={22} fill={theme.palette.primary.main} />
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
                                        <AccountBalanceWalletIcon size={22} fill={theme.palette.primary.main} />
                                    </Box>
                                </IconButton>
                                <HoverMenu
                                    hoverMenuOpen={hoverMenuOpen}
                                    setHoverMenuOpen={setHoverMenuOpen}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Container>
                {
                    mobileSearchOpen &&
                    <MobileSearch
                        mobileSearchOpen={mobileSearchOpen}
                        setMobileSearchOpen={setMobileSearchOpen}
                    />
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
