import { Box, ClickAwayListener, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import useSWR from "swr";
import { fetchWithAuth } from "../lib/swrFetchers";

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Link from "next/link";
import { ProfileAvatar } from "./ProfileAvatar";
import { useState } from "react";
import { truncateText } from "../lib/utils";
import axios from 'axios';

const HodlNotification = ({ item }) => {
    const { data: token } = useSWR(item.token ? [`/api/token`, item.token] : null,
        (url, query) => axios.get(`${url}/${query}`).then(r => r.data.token));

    return (
        <Box marginY={1.5}>
            <Stack direction="row" spacing={0.5} display="flex" alignItems="center">
                <ProfileAvatar profileAddress={item.subject} size="small" />
                <Box>{item.action}</Box>
                <Link href={`/nft/${item.token}`}>
                    <Typography component="a" sx={{ cursor: "pointer" }}>
                        &quot;{truncateText(token?.name)}&quot;
                    </Typography>
                </Link>
            </Stack>
        </Box>
    )
}

export const HodlNotifications = () => {
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    const [showNotifications, setShowNotifications] = useState(false);
    const { data: notifications } = useSWR(`/api/notifications/get`, fetchWithAuth)

    const toggleNotifications = async () => {
        setShowNotifications(prev => !prev);
    }


    return (
        <>
            {notifications ? <NotificationsIcon onClick={toggleNotifications} /> : <NotificationsNoneIcon onClick={toggleNotifications} />}
            {showNotifications &&
                <ClickAwayListener onClickAway={() => setShowNotifications(false)} touch={false}>
                    <Box
                        sx={{
                            position: 'absolute',
                            background: 'white',
                            color: 'black',
                            top: 60,
                            right: 0,
                            minWidth: '350px',
                            maxHeight: '500px',
                            overflow: 'auto',
                            border: `1px solid #f0f0f0`,
                            borderRadius: 1,
                            padding: 2,
                            animation: xs ?
                                showNotifications ? `slidein 0.25s forwards` : `slideout 0.25s forwards` :
                                showNotifications ? `fadein 0.25s forwards` : `fadeout 0.25s forwards`,

                        }}>
                        {(notifications || []).map((item, i) => <HodlNotification key={i} item={item} />)}
                    </Box>
                </ClickAwayListener>

            }
        </>)
}