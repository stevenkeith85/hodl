import Typography from '@mui/material/Typography';
import { SnackbarContent, CustomContentProps } from 'notistack'
import React from "react";
import { HodlBorderedBox } from '../HodlBorderedBox';
import { RocketLaunchIcon } from '../icons/RocketLaunchIcon';

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
        <RocketLaunchIcon size={18} fill={getColor()} />
        <Typography
          sx={{ color: theme => theme.palette.text.primary }}>{props.message}
        </Typography>
      </HodlBorderedBox>
    </SnackbarContent>
  );
});

HodlSnackbar.displayName = "HodlSnackbar"