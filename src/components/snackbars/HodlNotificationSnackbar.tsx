import React from "react";

import { SnackbarContent, CustomContentProps } from 'notistack'

import { HodlAction } from '../../models/HodlAction';
import { HodlBorderedBox } from '../HodlBorderedBox';

// TODO: Dynamic import might make sense here; can't see it reflected in the bundle size at the moment though.
import { HodlNotificationBox } from '../notifications/HodlNotificationBox';
// import dynamic from "next/dynamic";

// const HodlNotificationBox = dynamic(
//     () => import('../notifications/HodlNotificationBox').then((module) => module.HodlNotificationBox),
//     {
//         loading: () => <div style={{
//             width: '400px',
//             maxWidth: '100%',
//             margin: 0
//         }}>
//         </div>
//     }
// );

// TODO: Notistack has an error that we'd like to hide in the console (as we can't do anything about it)
interface HodlNotificationSnackbarProps extends CustomContentProps {
    action: HodlAction
}
export const HodlNotificationSnackbar = React.forwardRef<HTMLDivElement, HodlNotificationSnackbarProps>((props, ref) => {
    const {
        action,
        ...other
    } = props

    // TODO: We could get the last read time and update it if the user clicks on the snackbar here?
    return (
        // @ts-ignore
        <SnackbarContent
            ref={ref}
            role="alert"
            {...other}
        >
            <HodlBorderedBox sx={{ padding: 0, overflow: 'hidden', border: 'none' }}>
                <HodlNotificationBox
                    item={action}
                    setShowNotifications={() => { }}
                    lastRead={0}
                    sx={{
                        width: '400px',
                        maxWidth: '100%',
                        margin: 0
                    }} />
            </HodlBorderedBox>
        </SnackbarContent>
    )
})

HodlNotificationSnackbar.displayName = "NotificationSnackbar"