import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { Typography } from '@mui/material';
import { SnackbarContent, CustomContentProps } from 'notistack'
import React from "react";
import { HodlBorderedBox } from '../HodlBorderedBox';

interface HodlSnackbarProps extends CustomContentProps {
  type: "error" | "info" | "success";
}

export const HodlSnackbar = React.forwardRef<HTMLDivElement, HodlSnackbarProps>((props, ref) => {

  const getColor = () => {
      return theme => theme.palette[props.type].main;
  }

  return (
    //@ts-ignore
    <SnackbarContent
      ref={ref}
      role="alert"
      {...props}
    >
      <HodlBorderedBox
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}>
        <RocketLaunchIcon sx={{ fontSize: `18px`, color: getColor() }} />
        <Typography sx={{ color: theme => theme.palette.text.primary }}>{props.message}</Typography>
      </HodlBorderedBox>
    </SnackbarContent>
  );
});

HodlSnackbar.displayName = "HodlSnackbar"