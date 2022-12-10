import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import axios from 'axios'
import useSWR, { mutate } from 'swr';
import { RocketLaunchIcon } from '../icons/RocketLaunchIcon';
import { AccountBalanceWalletIcon } from '../icons/AccountBalanceWalletIcon';
import MenuIcon from '@mui/icons-material/Menu';
import { NotificationsIcon } from '../icons/NotificationsIcon';
import { NotificationsNoneIcon } from '../icons/NotificationsNoneIcon';

import {
    ActionTypes,
    HodlAction
} from '../../models/HodlAction';
import { UserAvatarAndHandleBodyLoading } from '../avatar/UserAvatarAndHandleBodyLoading';
import { WalletContext } from '../../contexts/WalletContext';

const CloseIcon = dynamic(
    () => import('../icons/CloseIcon').then(mod => mod.CloseIcon),
    {
        ssr: false,
        loading: () => null
    }
);

const UserAvatarAndHandle = dynamic(
    () => import('../avatar/UserAvatarAndHandle').then(mod => mod.UserAvatarAndHandle),
    {
        ssr: false,
        loading: () => <UserAvatarAndHandleBodyLoading size={40} handle={false} />
    }
);

const DesktopNav = dynamic(
    () => import('./DesktopNav').then(mod => mod.DesktopNav),
    {
        ssr: false,
        loading: () => null
    }
);

const MobileNav = dynamic(
    () => import('./MobileNav').then(mod => mod.MobileNav),
    {
        ssr: false,
        loading: () => null
    }
);

const SearchBox = dynamic(
    () => import('../Search').then(mod => mod.SearchBox),
    {
        ssr: false,
        loading: () => <Skeleton variant="rounded" width={157} height={36} />
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

const SessionExpiredModal = dynamic(
    () => import('../modals/SessionExpiredModal').then(mod => mod.SessionExpiredModal),
    {
        ssr: false,
        loading: () => null
    }
);

const ResponsiveAppBar = ({ address, pusher, userSignedInToPusher }) => {
    const theme = useTheme();

    const [error, setError] = useState('');

    const [hoverMenuOpen, setHoverMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const mdUp = useMediaQuery(theme.breakpoints.up('md'));
    const mdDown = useMediaQuery(theme.breakpoints.down('md'));

    const homepage = {
        label: 'hodl my moon',
        url: '/',
        icon: <RocketLaunchIcon size={22} fill={theme.palette.primary.main} />,
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


    const mutateAndNotify = async (action: HodlAction) => {
        if (action.action === ActionTypes.Bought ||
            action.action === ActionTypes.Listed ||
            action.action === ActionTypes.Delisted) {
            mutate([`/api/contracts/mutable-token`, action.objectId]);
        }

        const enqueueSnackbar = await import('notistack').then(mod => mod.enqueueSnackbar);

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
                                {
                                    mdUp && <DesktopNav address={address} />
                                }
                                {
                                    mdDown && <MobileNav address={address} />
                                }
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
                                {mdUp && <Box><SearchBox /></Box>}
                                {mdDown && <MobileSearchIcon
                                    mobileSearchOpen={mobileSearchOpen}
                                    setMobileSearchOpen={setMobileSearchOpen}
                                    setShowNotifications={setShowNotifications}
                                />
                                }
                                {/* Notifications button and menu */}
                                {showNotifications ?
                                    <IconButton
                                        sx={{
                                            margin: 0,
                                            padding: 0,
                                            lineHeight: 0,
                                            width: 40,
                                            height: 40,
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
                                                width: 40,
                                                height: 40,
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
                                                width: 40,
                                                height: 40,
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
                                {showNotifications && <HodlNotifications
                                    showNotifications={showNotifications}
                                    setShowNotifications={setShowNotifications}
                                />}

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
                                        width={40}
                                        height={40}
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
                                            size={40}
                                            address={address}
                                            withLink={false}
                                            handle={false}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: !hoverMenuOpen && !address ? 'flex' : 'none'
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
