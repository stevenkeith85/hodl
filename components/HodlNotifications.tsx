import { Box, ClickAwayListener, Fade, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import useSWR from "swr";
import { fetchWithAuth } from "../lib/swrFetchers";
import CloseIcon from '@mui/icons-material/Close';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Link from "next/link";
import { ProfileAvatar } from "./ProfileAvatar";
import { useContext, useEffect } from "react";
import axios from 'axios';
import { WalletContext } from "../contexts/WalletContext";
import formatDistance from 'date-fns/formatDistance';
import { NftAction } from "../models/HodlNotifications";
import { HodlImage } from "./HodlImage";
import { useRouter } from "next/router";


const HodlNotification = ({ item, setShowNotifications }) => {
    const { address } = useContext(WalletContext);
    const { data: token } = useSWR(item.token ? [`/api/token`, item.token] : null,
        (url, query) => axios.get(`${url}/${query}`).then(r => r.data.token));

    const lastRead = (localStorage.getItem(`notifications-${address}-last-read`) || 0);

    return (
        <Box sx={{ opacity: lastRead > (item?.timestamp || 0) ? 0.8 : 1 }} >
            <Box display="flex" alignItems="center" gap={2}>
                <Stack direction="row" spacing={0.5} display="flex" alignItems="center" onClick={() => setShowNotifications(false)} flexGrow={1}>
                    <ProfileAvatar profileAddress={item.subject} size="small" />
                    <Box>{item.action}</Box>
                    {item.token && <Link href={item.action === NftAction.CommentedOn ? `/nft/${item.token}?comment=${item.subject}-${item.timestamp}` : `/nft/${item.token}`}>
                        <Typography component="a" sx={{ cursor: "pointer" }}>
                            an NFT
                        </Typography>
                    </Link>}
                    {item.object === address && <Typography>you</Typography>}
                    <Typography sx={{ fontSize: 10, color: "#999" }}>{item.timestamp && formatDistance(new Date(item.timestamp), new Date(), { addSuffix: false })}</Typography>
                </Stack>
                {
                    item?.token && token?.image &&
                    <Link href={item.action === NftAction.CommentedOn ? `/nft/${item.token}?comment=${item.subject}-${item.timestamp}` : `/nft/${item.token}`}>
                        <a><HodlImage cid={token.image.split('//')[1]} effect={token.filter} height={'40px'} width={'40px'} /></a>
                    </Link>
                }
            </Box>
        </Box>
    )
}

export const HodlNotifications = ({ setHoverMenuOpen, showNotifications, setShowNotifications }) => {
    const router = useRouter();
    const theme = useTheme();
    const { address } = useContext(WalletContext);
    const xs = useMediaQuery(theme.breakpoints.only('xs'));


    const { data: notifications } = useSWR(address ? `/api/notifications/get` : null, fetchWithAuth)

    const toggleNotifications = async () => {
        setShowNotifications(prev => !prev);

        setTimeout(() => {
            localStorage.setItem(`notifications-${address}-last-read`, Date.now().toString());
        }, 5000)
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
            minWidth: { xs: 'none', sm: 'max-content' },
            height: { xs: 'calc(100vh - 56px)', sm: 'auto' },
            width: { xs: '100%', sm: 'auto' },
            overflow: 'auto',
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
        {notifications && notifications.length === 0 && 'You are up to date'}
        {(notifications || []).map((item, i) => <HodlNotification key={i} item={item} setShowNotifications={setShowNotifications} />)}
    </Box>

    return (
        <>
            {showNotifications ? <CloseIcon /> :
                (notifications && lastRead < (notifications[0]?.timestamp || 0) ?
                    <NotificationsIcon
                        sx={{
                            cursor: 'pointer',
                            animation: `shake 0.5s`,
                            animationDelay: '2s',
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