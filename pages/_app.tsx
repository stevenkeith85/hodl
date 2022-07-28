import { useState } from 'react';
import Head from 'next/head';
// import { AppProps } from 'next/app';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../theme';
import { SnackbarProvider } from 'notistack';
import { SWRConfig } from 'swr';
// import createEmotionCache from '../createEmotionCache';
import { WalletContext } from '../contexts/WalletContext';
// import { CacheProvider, EmotionCache } from '@emotion/react';
import '../styles/globals.css'

import Layout from '../components/layout/Layout';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../createEmotionCache';
import { AppProps } from 'next/app';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();


interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps } = props;

  const [signer, setSigner] = useState('');

  // we set props.pageProps.address in all pages, and add it to the context so that components have easy access. 
  // some components will require the context value, such as the app bar as it renders outside the page
  const [address, setAddress] = useState(props.pageProps.address || '');
  const [nickname, setNickname] = useState(''); // This will be getting removed

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SWRConfig value={{
          dedupingInterval: 10000, // default is 2000
          focusThrottleInterval: 10000, // default is 5000
          errorRetryCount: 0
        }}>
          <WalletContext.Provider value={{
            signer,
            setSigner,
            address,
            setAddress,
            nickname,
            setNickname
          }}>

            <SnackbarProvider maxSnack={3}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </SnackbarProvider>
          </WalletContext.Provider>
        </SWRConfig>
      </ThemeProvider>
    </CacheProvider>
  )
}
