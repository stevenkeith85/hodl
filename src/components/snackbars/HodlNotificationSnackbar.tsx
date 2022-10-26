import React from "react";
import { SnackbarContent, CustomContentProps } from 'notistack'
import dynamic from "next/dynamic";
import { HodlAction } from "../../models/HodlAction";

// @ts-ignore
interface HodlNotificationSnackbarProps extends CustomContentProps {
    // @ts-ignore
    hodlAction: HodlAction
}

const HodlNotificationBox = dynamic(
    () => import('../notifications/HodlNotificationBox').then(mod => mod.HodlNotificationBox),
    {
        loading: () => <div style={{
            width: '400px',
            height: '50px',
            maxWidth: '100%',
            margin: 0,
            background: '#ECF3FF',
            display: 'flex',
            alignItems: 'center',
            padding: '8px'

        }}>
            ...
        </div>
    }
);

export const HodlNotificationSnackbar = React.forwardRef<HTMLDivElement, HodlNotificationSnackbarProps>((props, ref) => {
    const {
        hodlAction: action,
        ...other
    } = props

    return (
        // @ts-ignore
        <SnackbarContent {...other} ref={ref} role="alert">
            <HodlNotificationBox
                item={props.hodlAction}
                setShowNotifications={() => { }}
                lastRead={0}
                sx={{
                    width: '400px',
                    maxWidth: '100%',
                    margin: 0
                }} />
        </SnackbarContent>
    )
});

HodlNotificationSnackbar.displayName = 'HodlNotificationSnackbar'