import { SnackbarContent, CustomContentProps } from 'notistack'
import React from "react";
import { mutate } from 'swr';
import { HodlAction } from '../../models/HodlAction';
import { HodlBorderedBox } from '../HodlBorderedBox';
import { HodlNotificationBox } from '../notifications/HodlNotificationBox';

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
            <HodlBorderedBox sx={{ padding: 0, overflow: 'hidden', border: 'none'}}>
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