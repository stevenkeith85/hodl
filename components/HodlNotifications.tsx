import { Box, ClickAwayListener, Stack, Typography } from "@mui/material";
import useSWR from "swr";
import { fetchWithAuth } from "../lib/swrFetchers";

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Link from "next/link";
import { getShortAddress, truncateText } from "../lib/utils";
import { HodlLink } from "./HodlLink";
import { ProfileAvatar } from "./ProfileAvatar";
import { useState } from "react";

const HodlNotification = ({ item }) => {

    const { data: token } = useSWR(item.token ? [`/api/token`, item.token] : null,
        (url, query) => fetch(`${url}/${query}`)
            .then(r => r.json())
            .then(json => json.token))

    return (
        <Stack direction="row" spacing={0.5} display="flex" alignItems="center">
            <ProfileAvatar profileAddress={item.subject} size="small" />
            <Box>{item.action}</Box>
            <Box>your NFT</Box>
            <Link href={`/nft/${item.token}`}>
                <Typography component="a" sx={{ cursor: "pointer" }}>
                    &quot;{token?.name}&quot;
                </Typography>
            </Link>
        </Stack>
    )
}

export const HodlNotifications = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const { data: notifications } = useSWR(`/api/notifications/get`, fetchWithAuth)

    return (
        <>
            {notifications ? <NotificationsIcon onClick={() => setShowNotifications(prev => !prev)} /> : <NotificationsNoneIcon onClick={() => setShowNotifications(prev => !prev)} />}
            {showNotifications &&
                <ClickAwayListener onClickAway={() => setShowNotifications(false)}>
                    <Stack spacing={1}
                        sx={{
                            position: 'absolute',
                            background: 'white',
                            color: 'black',
                            top: 60,
                            right: 0,
                            minWidth: '400px',
                            maxHeight:'300px',
                            overflow: 'auto',
                            border: `1px solid #f0f0f0`,
                            padding: 2

                        }}>
                        {(notifications || []).map((item, i) => <HodlNotification key={i} item={item} />)}
                    </Stack>
                </ClickAwayListener>
            }
        </>)
}