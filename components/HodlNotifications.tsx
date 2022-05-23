import { Box, ClickAwayListener, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import useSWR from "swr";
import { fetchWithAuth } from "../lib/swrFetchers";

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Link from "next/link";
import { ProfileAvatar } from "./ProfileAvatar";
import { useContext, useState } from "react";
import { truncateText } from "../lib/utils";
import axios from 'axios';
import { WalletContext } from "../contexts/WalletContext";
import formatDistance from 'date-fns/formatDistance';
import { NftAction } from "../models/HodlNotifications";


const HodlNotification = ({ item, setShowNotifications }) => {
    const { address } = useContext(WalletContext);
    const { data: token } = useSWR(item.token ? [`/api/token`, item.token] : null,
        (url, query) => axios.get(`${url}/${query}`).then(r => r.data.token));
    
    const lastRead = (localStorage.getItem(`notifications-${address}-last-read`) || 0);

    return (
        <Box marginY={1.5} sx={{ color: lastRead >= (item.timestamp || 0) ? '#999' : 'black'}}>
            <Stack direction="row" spacing={0.5} display="flex" alignItems="center" onClick={() => setShowNotifications(false)}>
                <ProfileAvatar profileAddress={item.subject} size="small" />
                <Box>{item.action}</Box>
                {item.token && <Link href={ item.action === NftAction.CommentedOn ? `/nft/${item.token}?comment=${item.subject}-${item.timestamp}`: `/nft/${item.token}`}>
                    <Typography component="a" sx={{ cursor: "pointer" }}>
                        &quot;{truncateText(token?.name)}&quot;
                    </Typography>
                </Link>}
                {item.object === address && <Typography>you</Typography>}
                <Typography sx={{ fontSize: 10, color: "#999"}}>{item.timestamp && formatDistance(new Date(item.timestamp), new Date(), { addSuffix: true } )}</Typography>
            </Stack>
        </Box>
    )
}

export const HodlNotifications = () => {
    const theme = useTheme();
    const { address } = useContext(WalletContext);
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    const [showNotifications, setShowNotifications] = useState(false);
    const { data: notifications } = useSWR( address ? `/api/notifications/get` : null, fetchWithAuth)

    const toggleNotifications = async () => {
        
        setShowNotifications(prev => !prev);

        setTimeout(() => {
            localStorage.setItem(`notifications-${address}-last-read`, Date.now().toString());
        }, 5000)
    }

    if (!address) {
        return null;
    }

    const lastRead = (localStorage.getItem(`notifications-${address}-last-read`) || 0);

    return (
        <>
            {notifications && lastRead < (notifications[0]?.timestamp || 0) ? <NotificationsIcon onClick={toggleNotifications} /> : <NotificationsNoneIcon onClick={toggleNotifications} />}
            {showNotifications &&
                <ClickAwayListener onClickAway={() => setShowNotifications(false)} touchEvent={false}>
                    <Box
                        sx={{
                            position: 'absolute',
                            background: 'white',
                            color: 'black',
                            top: 56,
                            right: 0,
                            minWidth: '500px',
                            maxHeight: xs ? '100vh': '500px',
                            overflow: 'auto',
                            border: `1px solid #f0f0f0`,
                            marginLeft: xs? '-16px' : 0,
                            marginRight: xs? '-16px' : 0,
                            height: xs ? 'calc(100vh - 56px)': 'auto',
                            borderRadius: xs ? 0: 1,
                            padding: 2,
                            animation: xs ?
                                showNotifications ? `slidein 0.25s forwards` : `slideout 0.25s forwards` :
                                showNotifications ? `fadein 0.25s forwards` : `fadeout 0.25s forwards`,

                        }}>
                        {(notifications || []).map((item, i) => <HodlNotification key={i} item={item} setShowNotifications={setShowNotifications} />)}
                    </Box>
                </ClickAwayListener>

            }
        </>)
}