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

  return (
    <SnackbarContent ref={ref} role="alert" {...other}>
      <HodlNotificationBox item={action} setShowNotifications={() => {}} lastRead={0} sx={{ margin: 0, width: '400px'}}/>
    </SnackbarContent>
  )
})