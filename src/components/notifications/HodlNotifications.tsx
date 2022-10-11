import { Box, ClickAwayListener, Fade, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useCallback, useContext, useEffect, useRef } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { useRouter } from "next/router";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { useActions } from "../../hooks/useActions";
import { HodlNotificationBox } from "./HodlNotificationBox";
import { ActionSet, HodlAction } from "../../models/HodlAction";
import InfiniteScroll from "react-swr-infinite-scroll";
import useSWR from "swr";
import axios from "axios";
import { PusherContext } from "../../contexts/PusherContext";


export const HodlNotifications = ({
    setHoverMenuOpen,
    showNotifications,
    setShowNotifications,
    limit = 10
}) => {
    const { pusher, userSignedInToPusher } = useContext(PusherContext);

    const router = useRouter();
    const theme = useTheme();
    const { address } = useContext(WalletContext);
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    const { actions: notifications } = useActions(showNotifications, ActionSet.Notifications, limit);

    // TODO: Move to hook
    const { data: unread, mutate: mutateUnread } = useSWR(address ? ['/api/notifications', address] : null,
        (url, address) => axios.get(url).then(r => Boolean(r.data.unread))
    );

    const { data: lastRead, mutate: mutateLastRead } = useSWR(address ? ['/api/notifications/read', address] : null,
        (url, address) => axios.get(url).then(r => r.data),
        {
            revalidateOnFocus: false // we don't need to revalidate unless we actually read the messages. we call mutate when we do that
        }
    );

    const ringNotificationBell =  () => {
        mutateUnread(true, { revalidate: false });
    }

    // Get real time updates about notifications! :)
    useEffect(() => {
        console.log('Pusher - setting up notification bell updates');
        console.log('Pusher - pusher / user ', pusher, userSignedInToPusher);

        if (!pusher || !userSignedInToPusher) {    
            return;
        }

        pusher.user.bind('notification', ringNotificationBell);

        return () => {
            console.log('Pusher - cleaning up notification bell updates');
            pusher.user.unbind('notification', ringNotificationBell);
        }

    }, [pusher, userSignedInToPusher]);

    // when the user closes the notifications, we'll update the last read on the UI so that they don't get the highlight effect next time
    useEffect(() => {
        if (!showNotifications) {
            mutateLastRead();
        }
    }, [showNotifications])


    const toggleNotifications = async () => {
        setShowNotifications(prev => !prev);

        setTimeout(async () => {
            try {
                const r = await axios.post(
                    '/api/notifications/read',
                    {
                        headers: {
                            'Accept': 'application/json',
                        },
                    }
                );

                mutateUnread();

            } catch (error) {
            }
        }, 1000)
    }

    const handleRouteChange = useCallback(() => {
        if (showNotifications) {
            setShowNotifications(false)
        }
    }, [showNotifications, setShowNotifications]);

    useEffect(() => {
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        };

    }, [router.events, handleRouteChange]);

    if (!address) {
        return null;
    }

    const menu = <Box
        sx={{
            position: { xs: 'fixed', sm: 'absolute' },
            zIndex: 100,
            background: 'white',
            color: 'black',
            top: 56,
            right: 0,
            minWidth: { sm: '525px' },
            maxHeight: { sm: '425px' },
            height: { xs: 'calc(100vh - 56px)', sm: 'auto' },
            width: { xs: '100%', sm: 'auto' },
            overflowX: 'hidden',
            overflowY: 'auto',
            border: `1px solid #ddd`,
            margin: 0,
            padding: 1,
            borderRadius: xs ? 0 : 1,
            boxShadow: '0 0 2px 1px #eee',
        }}
        display="flex"
        flexDirection="column"
    >
        {
            notifications?.data && !notifications?.data?.[0]?.items?.length &&
            <Typography padding={2}>No notifications at the moment</Typography>
        }
        <InfiniteScroll
            swr={notifications}
            loadingIndicator={<HodlLoadingSpinner />}
            isReachingEnd={
                swr => {
                    return swr.data?.[0]?.items?.length == 0 ||
                        swr.data?.[swr.data?.length - 1]?.items?.length < limit
                }
            }
        >
            {
                ({ items }) => (items || []).map((item: HodlAction) =>
                    <HodlNotificationBox
                        key={item.id}
                        item={item}
                        setShowNotifications={setShowNotifications}
                        lastRead={lastRead}
                    />
                )
            }
        </InfiniteScroll>
    </Box>

    return (
        <>
            <IconButton
                size="large"
                sx={{
                    margin: 0,
                    padding: 0
                }}
                color="inherit"
            >
                <Box
                    width={44}
                    height={44}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    {showNotifications ?

                        <CloseIcon color="primary" />

                        :
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
                                    toggleNotifications()
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
                                    toggleNotifications()
                                }}
                            />)
                    }
                </Box>
            </IconButton>
            <ClickAwayListener
                onClickAway={() => {
                    if (showNotifications) {
                        setShowNotifications(false)
                    }
                }}
                touchEvent={false}>
                <Fade in={showNotifications} timeout={300} >{menu}</Fade>
            </ClickAwayListener>
        </>)
}