import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { CloseIcon } from '../icons/CloseIcon';

import { NotificationsIcon } from '../icons/NotificationsIcon';
import { NotificationsNoneIcon } from '../icons/NotificationsNoneIcon';
import { HodlNotifications } from '../notifications/HodlNotifications';

import { useContext, useEffect } from 'react';

import axios from 'axios'
import useSWR, { mutate } from 'swr';

import {
    ActionTypes,
    HodlAction
} from '../../models/HodlAction';
import { PusherContext } from '../../contexts/PusherContext';
import { SignedInContext } from '../../contexts/SignedInContext';


export const NotificationsButtonAndMenu = ({
    showNotifications,
    setHoverMenuOpen,
    setMobileSearchOpen,
    setShowNotifications,
}) => {

    const { pusher, userSignedInToPusher } = useContext(PusherContext);
    const { signedInAddress: address } = useContext(SignedInContext);

    const theme = useTheme();

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

    return (<>
        {showNotifications ?
            <IconButton
                sx={{
                    margin: 0,
                    padding: 0,
                    lineHeight: 0,
                    width: 40,
                    height: 40,
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
    </>)
}