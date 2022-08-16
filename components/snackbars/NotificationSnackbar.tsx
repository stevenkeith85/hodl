import { SnackbarContent, CustomContentProps } from 'notistack'
import React from "react";
import { HodlAction } from '../../models/HodlAction';
import { HodlNotificationBox } from '../notifications/HodlNotificationBox';

interface NotificationSnackbarProps extends CustomContentProps {
  action: HodlAction
}

export const NotificationSnackbar = React.forwardRef<HTMLDivElement, NotificationSnackbarProps>((props, ref) => {
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
      <HodlNotificationBox 
        item={action} 
        setShowNotifications={() => {}} 
        lastRead={0} 
        sx={{ 
            width: '400px'
        }}/>
    </SnackbarContent>
  )
})

NotificationSnackbar.displayName="NotificationSnackbar"