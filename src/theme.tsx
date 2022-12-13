import { createTheme, responsiveFontSizes } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    logo: {
      fontFamily: string;
      fontWeight: number;
      fontSize: number;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    logo?: {
      fontFamily: string;
      fontWeight: number;
      fontSize: number;
    };
  }
}

let theme = createTheme({
  palette: {
    primary: {
      main: "#05778A",
    },
    secondary: {
      main: '#ec4899',
    },
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: "Nunito Sans, sans-serif",
    h1: {
      fontSize: '18px',
      fontWeight: 600
    },
    h2: {
      fontSize: '16px',
      fontWeight: 500
    },
    h3: {
      fontSize: '14px',
      fontWeight: 500
    },
    body1: {
      fontSize: '14px',
    },
    body2: {
      fontSize: '14px',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1150,
      xl: 1150//1536,
    },
  },
  components: {
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        variant: 'outlined'
      },
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          padding: '5px 10px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 'auto'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minHeight: 'auto',
          margin: `0 0 8px 0`,
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid rgba(0,0,0,0.1)`
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px',
          '&:last-child': {
            paddingBottom: '16px'
          }    
        }
      }
    },
    MuiImageListItemBar: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          ...(ownerState?.position === 'top' && {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8
          }),
          ...(ownerState?.position !== 'top' && {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8
          })
        }),
        titleWrap: {
          padding: 8
        },
      }
    }
  },
  logo: {
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 300,
    fontSize: 22
  },
});

theme = responsiveFontSizes(theme, { factor: 1 });

export default theme;
