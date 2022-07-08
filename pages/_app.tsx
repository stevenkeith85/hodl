import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import ResponsiveAppBar from '../components/layout/AppBar';
import theme from '../theme';
import Footer from '../components/layout/Footer';
import { SnackbarProvider } from 'notistack';
import { SWRConfig } from 'swr';
import createEmotionCache from '../createEmotionCache';
import { WalletContext } from '../contexts/WalletContext';
import { CacheProvider } from '@emotion/react';
import '../styles/globals.css'
import { useRouter } from 'next/router';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const router = useRouter();

  const [signer, setSigner] = useState('');
  const [address, setAddress] = useState('');
  const [nickname, setNickname] = useState(''); // This will be getting removed

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <SWRConfig value={{
        dedupingInterval: 20000, // default is 2000
        focusThrottleInterval: 20000, // default is 5000
        errorRetryCount: 1,
        revalidateOnMount: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
      }}>
        <WalletContext.Provider value={{ signer, setSigner, address, setAddress, nickname, setNickname }}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider
              maxSnack={3}
            >
              <CssBaseline />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh',
                  header: {
                    flexGrow: 0,
                    flexShrink: 0,
                    flexBasis: 'auto'
                  },
                  footer: {
                    flexGrow: 0,
                    flexShrink: 0,
                    flexBasis: 'auto'
                  },
                  main: {
                    flexGrow: 1,
                    flexShrink: 0,
                    flexBasis: 'auto'
                  }
                }}>
                <header>
                  <ResponsiveAppBar />
                </header>
                <main>
                  <Container
                    maxWidth="xl">
                    <Component {...pageProps} />
                  </Container>
                </main>
                <footer>
                  <Footer showFooter={router.asPath !== '/'} />
                </footer>
              </Box>
            </SnackbarProvider>
          </ThemeProvider>
        </WalletContext.Provider>
      </SWRConfig>
    </CacheProvider>
  )
}

export default MyApp
