import { makeStyles, useStyles } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { FC } from 'react';


const useStyles = makeStyles(({ palette }) => ({
    // default variant
    contentRoot: {
       backgroundColor: 'aqua',
    },
    variantSuccess: {
      backgroundColor: palette.success.main,
    },
    variantError: {
      backgroundColor: palette.error.main,
    },
    variantInfo: {
      backgroundColor: palette.info.main,
    },
    variantWarning: {
      backgroundColor: palette.warning.main,
    },
  }));
  
  export const NotistackProvider: FC = ({ children }) => {
    const classes = useStyles();
    return <SnackbarProvider classes={classes} children={children} />;
  };