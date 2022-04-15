// import '../styles/globals.css'
import { createContext, useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Box, Container, CssBaseline, snackbarClasses, ThemeProvider } from '@mui/material';
import ResponsiveAppBar from '../components/AppBar';
import theme from '../theme';
import Footer from '../components/Footer';
import { SnackbarProvider } from 'notistack';
import { SWRConfig } from 'swr';

export const WalletContext = createContext<{
  signer: any,
  setSigner: Function,
  address: any,
  setAddress: Function,
  nickname: any,
  setNickname: Function,
  jwt: any,
  setJwt: Function
}>(null);


function MyApp({ Component, pageProps }: AppProps) {
  const [signer, setSigner] = useState('');
  const [address, setAddress] = useState('');
  const [nickname, setNickname] = useState(''); // This will be getting removed

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <SWRConfig value={{
        dedupingInterval: 4000, // default is 2000
        focusThrottleInterval: 10000, // default is 5000
        errorRetryCount: 0, // possibly just for dev
      }}>
        <WalletContext.Provider value={{ signer, setSigner, address, setAddress, nickname, setNickname }}>
            <ThemeProvider theme={theme}>
            <SnackbarProvider
              maxSnack={3}
            >
              <CssBaseline />
              <Box sx={{
                minHeight: '100vh',
                position: 'relative',
                paddingBottom: { // for footer
                  xs: '520px',
                  md: '280px',
                },
              }}>
                <ResponsiveAppBar />
                <Container maxWidth="xl">
                  <Component {...pageProps} />
                </Container>
                <Footer />
              </Box>
              </SnackbarProvider>
            </ThemeProvider>
        </WalletContext.Provider>
      </SWRConfig>
    </>
  )
}

export default MyApp
