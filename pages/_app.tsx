// import '../styles/globals.css'
import { createContext, useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import ResponsiveAppBar from '../components/AppBar';
import theme from '../theme';
import Footer from '../components/Footer';
import { createEmotionCache } from '../createEmotionCache';
import { CacheProvider } from '@emotion/react'

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

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, pageProps }: AppProps) {
  const [signer, setSigner] = useState('');
  const [address, setAddress] = useState('');
  const [nickname, setNickname] = useState('');
  const [jwt, setJwt] = useState('');

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <WalletContext.Provider value={{ signer, setSigner, address, setAddress, nickname, setNickname, jwt, setJwt }}>
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
      </WalletContext.Provider>
    </CacheProvider>
  )
}

export default MyApp
