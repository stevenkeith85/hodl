import { createTheme, responsiveFontSizes  } from '@mui/material/styles';
import { indigo, pink } from '@mui/material/colors';

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

const theme = responsiveFontSizes(createTheme({
  spacing: 6,
  palette: {
    primary: {
      // light: '#757ce8',
      main: indigo[500],
      //main: '#3f50b5',
      // dark: '#002884',
      // contrastText: '#fff',
    },
    secondary: {
      // light: '#ff7eca',
      //main: pink[400],
       main: '#ec4899',
      // dark: '#b5006b',
      // contrastText: '#fff',
    },
    // error: {}
    // warning: {},
    // info: {},
    // success: {}
    contrastThreshold: 3,
    tonalOffset: 0.2
  },
  typography: {
    fontFamily: "Nunito Sans, Roboto, sans-serif",
    fontSize: 14,
    h1: {
      fontSize: 17,
      fontWeight: 600,
      
    },
    h2: {
      fontSize: 15,
      fontWeight: 600,
    },
    h3: {
      fontSize: 14,
      fontWeight: 400,
    },
    // h4: {},
    // h5: {},
    // h6: {},
    // subtitle1: {},
    // subtitle2: {},
    body1: {
      fontSize: 14,
    },
    body2: {
      fontSize: 14,
    },
    button: {
      fontSize: 14,
      fontWeight: 400,
      textTransform: 'none',
      textAlign: 'center',
    },
    // caption: {}
    // overline: {}
  },
  logo: {
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 300,
    fontSize: 22
  },
}));

export default theme;
