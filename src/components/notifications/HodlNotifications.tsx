import dynamic from 'next/dynamic';
import { useCallback, useContext, useEffect } from "react";

import { useRouter } from "next/router";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';

import axios from "axios";

import InfiniteScroll from "react-swr-infinite-scroll";
import useSWR from "swr";

import { WalletContext } from "../../contexts/WalletContext";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { useActions } from "../../hooks/useActions";

import { ActionSet, HodlAction } from "../../models/HodlAction";

import { HodlNotificationBoxLoading } from './HodlNotificationBoxLoading';
const HodlNotificationBox = dynamic(
    () => import('./HodlNotificationBox').then(mod => mod.HodlNotificationBox),
    {
        ssr: false,
        loading: () => <HodlNotificationBoxLoading />
    }
);

interface HodlNotificationsProps {
    showNotifications: boolean;
    setShowNotifications: Function;
    limit?: number
}

export const HodlNotifications: React.FC<HodlNotificationsProps> = ({
    showNotifications,
    setShowNotifications,
    limit = 10
}) => {
    const router = useRouter();

    const { address } = useContext(WalletContext);

    const { actions: notifications } = useActions(showNotifications, ActionSet.Notifications, limit, null, true);

    const { data: lastRead, mutate: mutateLastRead } = useSWR(address ? ['/api/notifications/read', address] : null,
        (url, address) => axios.get(url).then(r => r.data),
        {
            revalidateOnFocus: false // we don't need to revalidate unless we actually read the messages. we call mutate when we do that
        }
    );

    useEffect(() => {
        if (!showNotifications) {
            return;
        }

        setTimeout(async () => {
            // update the time the user last read their notificationns
            try {
                const r = await axios.post(
                    '/api/notifications/read',
                    {
                        headers: {
                            'Accept': 'application/json',
                        },
                    }
                );

                mutateLastRead();

            } catch (error) {
            }
        }, 1000)
    }, [showNotifications])


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

    return (
        <>
            <ClickAwayListener
                onClickAway={() => {
                    if (showNotifications) {
                        setShowNotifications(false)
                    }
                }}
                touchEvent={false}>
                <Fade in={showNotifications} timeout={300} >
                    <Box
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
                            borderRadius: {
                                xs: 0,
                                sm: 1
                            },
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
                            loadingIndicator={<HodlLoadingSpinner sx={{ textAlign: 'center', padding: 2 }} />}
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
                </Fade>
            </ClickAwayListener>
        </>)
}
