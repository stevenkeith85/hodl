import { useState } from 'react';
import Head from 'next/head';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../theme';
import { SnackbarProvider } from 'notistack';
import { SWRConfig } from 'swr';
import createEmotionCache from '../createEmotionCache';
import { WalletContext } from '../contexts/WalletContext';
import { CacheProvider } from '@emotion/react';
import '../styles/globals.css'

import Layout from '../components/layout/Layout';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const [signer, setSigner] = useState('');

  // we set props.pageProps.address in all pages, and add it to the context so that components have easy access. 
  // some components will require the context value, such as the app bar as it renders outside the page
  const [address, setAddress] = useState(props.pageProps.address || ''); 
  const [nickname, setNickname] = useState(''); // This will be getting removed

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <SWRConfig value={{
        dedupingInterval: 30000, // default is 2000
        focusThrottleInterval: 30000, // default is 5000
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
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </SnackbarProvider>
          </ThemeProvider>
        </WalletContext.Provider>
      </SWRConfig>
    </CacheProvider>
  )
}


export default MyApp
