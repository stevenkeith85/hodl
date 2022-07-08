import { Box, ClickAwayListener, Fade, useMediaQuery, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useContext, useEffect } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { useRouter } from "next/router";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import { useNotifications } from "../../hooks/useNotifications";
import { HodlNotificationBox } from "./HodlNotificationBox";
import { ActionTypes } from "../../models/HodlAction";

export const HodlNotifications = ({
    setHoverMenuOpen,
    showNotifications,
    setShowNotifications
}) => {
    const router = useRouter();
    const theme = useTheme();
    const { address } = useContext(WalletContext);
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    const { notifications, isLoading, isError } = useNotifications(showNotifications);

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
            maxHeight: '50vh',
            height: { xs: 'calc(100vh - 56px)', sm: 'auto' },
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
        {isLoading && <HodlLoadingSpinner />}
        {notifications && notifications.length === 0 && 'No recent notifications'}

        {(
            notifications &&
            notifications.filter(x =>
                x.action !== ActionTypes.Added && 
                x.action !== ActionTypes.Listed
            ) || []
        ).map((item, i) => <HodlNotificationBox key={i} item={item} setShowNotifications={setShowNotifications} />)}
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