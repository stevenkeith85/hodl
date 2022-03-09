import { createTheme } from '@mui/material/styles';

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

const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7eca',
      main: '#ec4899',
      dark: '#b5006b',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: "Nunito Sans, Roboto, sans-serif",
    h1: {
      fontSize: 22,
      fontWeight: 500,
    },
    h2: {
      fontSize: 20,
      fontWeight: 400
    }
  },
  logo: {
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 300,
    fontSize: 22
  },
});

export default theme;
