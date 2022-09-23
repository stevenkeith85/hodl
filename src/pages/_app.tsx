import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../theme';
import { SnackbarProvider } from 'notistack';
import { SWRConfig } from 'swr';
import { WalletContext } from '../contexts/WalletContext';
import { ConfirmProvider } from 'material-ui-confirm';

import Layout from '../components/layout/Layout';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../createEmotionCache';
import { AppProps } from 'next/app';


import '../styles/globals.css'

import { PusherContext } from '../contexts/PusherContext';
import Pusher from 'pusher-js';

import { HodlNotificationSnackbar } from '../components/snackbars/HodlNotificationSnackbar';
import { HodlSnackbar } from '../components/snackbars/HodlSnackbar';

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

  const [pusher, setPusher] = useState(null);
  const [userSignedInToPusher, setUserSignedInToPusher] = useState(false); // TODO

  const setPusherSignInSuccess = () => {
    setUserSignedInToPusher(true);
  };

  useEffect(() => {
    console.log('Pusher - setting up pusher');

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      forceTLS: true,
      userAuthentication: {
        endpoint: "/api/pusher/user-auth",
        transport: "ajax"
      }
    });
    setPusher(pusher);

    pusher.bind('pusher:signin_success', setPusherSignInSuccess);
    pusher.signin();

    return () => {
      console.log('Pusher - cleaning up pusher');
      pusher.unbind('pusher:signin_success', setPusherSignInSuccess);
      setPusher(null);
      setUserSignedInToPusher(false);
    };

  }, [address])

  return (
    <CacheProvider value={emotionCache}>
      <ConfirmProvider>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SWRConfig value={{
            dedupingInterval: 15000, // default is 2000
            focusThrottleInterval: 15000, // default is 5000
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
              <PusherContext.Provider value={{
                pusher,
                setPusher,
                userSignedInToPusher,
                setUserSignedInToPusher
              }}>
                <SnackbarProvider
                  Components={{
                    // @ts-ignore
                    hodlnotification: HodlNotificationSnackbar,
                    // @ts-ignore
                    hodlsnackbar: HodlSnackbar
                  }}
                >
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </SnackbarProvider>
              </PusherContext.Provider>
            </WalletContext.Provider>
          </SWRConfig>
        </ThemeProvider>
      </ConfirmProvider>
    </CacheProvider>
  )
}
