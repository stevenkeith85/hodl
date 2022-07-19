import { Box, ClickAwayListener, Fade, Typography, useMediaQuery, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useContext, useEffect } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { useRouter } from "next/router";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { useActions } from "../../hooks/useActions";
import { HodlNotificationBox } from "./HodlNotificationBox";
import { ActionSet, HodlAction } from "../../models/HodlAction";
import InfiniteScroll from "react-swr-infinite-scroll";
import { HodlImpactAlert } from "../HodlImpactAlert";

export const HodlNotifications = ({
    setHoverMenuOpen,
    showNotifications,
    setShowNotifications,
    limit = 4
}) => {
    const router = useRouter();
    const theme = useTheme();
    const { address } = useContext(WalletContext);
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    const { actions: notifications } = useActions(showNotifications, ActionSet.Notifications, limit);

    const toggleNotifications = async () => {
        setShowNotifications(prev => !prev);

        setTimeout(() => {
            localStorage.setItem(`notifications-${address}-last-read`, Date.now().toString());
        }, 1000)
    }

    const handleRouteChange = () => {
        if (showNotifications) {
            setShowNotifications(false)
        }
    }

    useEffect(() => {
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        };

    }, [router.events]);

    if (!address) {
        return null;
    }

    const lastRead = (localStorage.getItem(`notifications-${address}-last-read`) || 0);

    const menu = <Box
        sx={{
            position: { xs: 'fixed', sm: 'absolute' },
            zIndex: 100,
            background: 'white',
            color: 'black',
            top: 56,
            right: 0,
            minWidth: '500px',
            // maxHeight: '33vh',
            height: { xs: 'calc(100vh - 56px)', sm: '300px' },
            width: { xs: '100%', sm: 'auto' },
            overflowY: 'auto',
            border: `1px solid #ddd`,
            margin: 0,
            padding: 2,
            borderRadius: xs ? 0 : 1,
            boxShadow: '0 0 2px 1px #eee',
        }}
        display="flex"
        flexDirection="column"
        gap={2}
    >
        {
            notifications.data && !notifications.data[0].items.length &&
            <Typography marginTop={2}>No notifications at the moment</Typography>
        }
        {notifications.data && <InfiniteScroll
            swr={notifications}
            loadingIndicator={<HodlLoadingSpinner />}
            isReachingEnd={notifications =>
                !notifications.data[0].items.length ||
                notifications.data[notifications.data.length - 1]?.items.length < limit
            }
        >
            {
                ({ items }) => {
                    return (items || []).map((item: HodlAction) => <>
                        {item && <HodlNotificationBox key={item.id} item={item} setShowNotifications={setShowNotifications} />}
                    </>
                    )
                }
            }
        </InfiniteScroll>}
    </Box>

    return (
        <>
            {showNotifications ? <CloseIcon /> :
                (notifications && lastRead < (notifications[0]?.timestamp || 0) ?
                    <NotificationsIcon
                        sx={{
                            cursor: 'pointer',
                            animation: `shake 0.5s`,
                            animationDelay: '0.5s',
                            animationTimingFunction: 'ease-in'
                        }}
                        onClick={e => {
                            e.stopPropagation();
                            setHoverMenuOpen(false);
                            toggleNotifications()
                        }
                        } /> :
                    <NotificationsNoneIcon
                        sx={{
                            cursor: 'pointer',
                        }}
                        onClick={e => {
                            e.stopPropagation();
                            setHoverMenuOpen(false);
                            toggleNotifications()
                        }}
                    />)
            }

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