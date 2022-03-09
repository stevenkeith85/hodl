// import '../styles/globals.css'
import { createContext, useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import ResponsiveAppBar from '../components/AppBar';
import theme from '../theme';
import Footer from '../components/Footer';

export const WalletContext = createContext<{ wallet: any, setWallet: Function, address: any, setAddress: Function }>(null);


function MyApp({ Component, pageProps }: AppProps) {

  const [wallet, setWallet] = useState<{ provider: any, signer: any }>({
    provider: null,
    signer: null,
  });

  const [address, setAddress] = useState('');

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito+Sans:300,400,500" />
      </Head>
      <CssBaseline />
      <WalletContext.Provider value={{ wallet, setWallet, address, setAddress }}>
        <ThemeProvider theme={theme}>
          <Box sx={{
            minHeight: '100vh',
            position: 'relative',
            paddingBottom: {
              xs: '540px',
              // md: '320px'
            }
          }}>
            <ResponsiveAppBar />
            <Container maxWidth="xl">
              <Component {...pageProps} />
            </Container>
            <Footer />
          </Box>
        </ThemeProvider>
      </WalletContext.Provider>
    </>
  )
}

export default MyApp
