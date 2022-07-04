import { Box, ClickAwayListener, Fade, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import useSWR from "swr";
import { fetchWithAuth, fetchWithId } from "../lib/swrFetchers";
import CloseIcon from '@mui/icons-material/Close';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Link from "next/link";
import { ProfileAvatar } from "./ProfileAvatar";
import { FC, useContext, useEffect } from "react";
import axios from 'axios';
import { WalletContext } from "../contexts/WalletContext";
import formatDistance from 'date-fns/formatDistance';
import { HodlNotification, NotificationTypes } from "../models/HodlNotifications";
import { HodlImage } from "./HodlImage";
import { useRouter } from "next/router";
import { truncateText } from "../lib/utils";
import { ProfileNameOrAddress } from "./ProfileNameOrAddress";

interface HodlNotificationBoxProps {
    item: HodlNotification;
    setShowNotifications: Function;
}

const HodlNotificationBox: FC<HodlNotificationBoxProps> = ({ item, setShowNotifications }) => {
    const { address } = useContext(WalletContext);


    const { data: comment } = useSWR(item.object === "comment" ? [`/api/comment`, item.objectId] : null,
        fetchWithId,
        {
            revalidateOnMount: true
        });

    const { data: token } = useSWR(item.object === "token" ? [`/api/token`, item.objectId] : comment ? [`/api/token`, comment.tokenId] : null,
        (url, query) => axios.get(`${url}/${query}`).then(r => r.data.token),
        {
            revalidateOnMount: true
        });

    

    const lastRead = (localStorage.getItem(`notifications-${address}-last-read`) || 0);

    return (
        <Box sx={{ opacity: lastRead > (item?.timestamp || 0) ? 0.8 : 1 }} >
            <Box display="flex" alignItems="center" gap={1} >
                <Box display="flex" alignItems="center" onClick={() => setShowNotifications(false)} gap={0.5} flexGrow={1}>
                    <ProfileAvatar profileAddress={item.subject} size="small" showNickname={false} />
                    <Box display="flex" alignItems="center" gap={0.5}>

                        <Box display="flex" sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                            {/* {item?.subject && <ProfileNameOrAddress color={"primary"} profileAddress={item.subject} size={"small"} />} */}
                            {/* {JSON.stringify(item)} */}
                            {/* Liked */}
                            {item.action === NotificationTypes.Liked && item.object === "token" && token && <>
                                <Link href={`/nft/${item.objectId}`} passHref>
                                    <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                        liked your token.
                                    </Typography>
                                </Link>
                            </>

                            }
                            {item.action === NotificationTypes.Liked && item.object === "comment" && comment && <>

                                <Link href={`/nft/${comment.tokenId}?comment=${comment.id}`}>
                                    <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                        liked your comment: {truncateText(comment.comment, 20)}.
                                    </Typography>
                                </Link>
                            </>
                            }

                            {/* Commented / Replied */}
                            {item.action === NotificationTypes.CommentedOn && item.object === "comment" && comment && <>
                                {comment.object === "token" && <>
                                    <Link href={`/nft/${comment.tokenId}?comment=${comment.id}`}>
                                        <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                            commented: {truncateText(comment.comment, 20)}.
                                        </Typography>
                                    </Link>
                                </>}
                                {comment.object === "comment" && <>
                                    <Link href={`/nft/${comment.tokenId}?comment=${comment.objectId}`}>
                                        <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                            replied: {truncateText(comment.comment, 20)}.
                                        </Typography>
                                    </Link>
                                </>}
                            </>
                            }

                            {/* Listed */}
                            {
                                item.action === NotificationTypes.Listed &&
                                <Link href={`/nft/${item.objectId}`}>
                                    <Typography component="a" sx={{ textDecoration: 'none', color: '#333' }}>
                                        listed a token
                                    </Typography>
                                </Link>
                            }

                            {/* Bought */}
                            {
                                item.action === NotificationTypes.Bought &&
                                <Link href={`/nft/${item.objectId}`}>
                                    <Typography component="a" sx={{ cursor: "pointer" }}>
                                        bought a token
                                    </Typography>
                                </Link>
                            }

                            {/* Followed */}
                            {
                                item.action === NotificationTypes.Followed &&
                                <Typography >
                                    followed you.
                                </Typography>
                            }
                        </Box>
                        <Typography sx={{ fontSize: 10, color: "#999" }}>{item.timestamp && formatDistance(new Date(item.timestamp), new Date(), { addSuffix: false })}</Typography>
                    </Box>
                </Box>
                {
                    token && token?.image &&
                    <Link href={comment ? `/nft/${comment.tokenId}` : `/nft/${item.objectId}`}>
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

    const { data: notifications } = useSWR(
        address ? [`/api/notifications/get`, address] : null,
        fetchWithAuth,
        { revalidateOnMount: true })

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
            // minWidth: '400px',
            maxHeight: '50vh',
            height: { xs: 'calc(100vh - 56px)', sm: 'auto' },
            width: { xs: '100%', sm: notifications?.length ? '500px' : 'auto' },
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
        {notifications && notifications.length === 0 && 'You are up to date'}
        {(notifications || []).map((item, i) => <HodlNotificationBox key={i} item={item} setShowNotifications={setShowNotifications} />)}
    </Box>

    return (
        <>
            {showNotifications ? <CloseIcon /> :
                (notifications && lastRead < (notifications[0]?.timestamp || 0) ?
                    <NotificationsIcon
                        sx={{
                            cursor: 'pointer',
                            animation: `shake 0.5s`,
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