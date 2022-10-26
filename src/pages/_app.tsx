import React from "react";
import { useEffect, useState } from 'react';

import Head from 'next/head';
import App, { AppProps } from 'next/app';
import dynamic from "next/dynamic";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { SnackbarProvider } from 'notistack';
import { SWRConfig } from 'swr'
import { CacheProvider, EmotionCache } from '@emotion/react';
import Cookies from "universal-cookie"

import '../styles/globals.css'
import { PusherContext } from '../contexts/PusherContext';
import { WalletContext } from '../contexts/WalletContext';

import { HodlNotificationSnackbar } from '../components/snackbars/HodlNotificationSnackbar';

const LoginPage = dynamic(
  () => import('./login'),
);

import theme from '../theme';
import createEmotionCache from '../createEmotionCache';

// Also loads a lot of deps
import Layout from '../components/layout/Layout';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  console.log('MyApp');

  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps } = props;

  // WalletContext state
  // @ts-ignore
  const [address, setAddress] = useState(props?.pageProps?.address); 
  const [signer, setSigner] = useState('');
  
  // PusherContext state
  const [pusher, setPusher] = useState(null);
  const [userSignedInToPusher, setUserSignedInToPusher] = useState(false); // TODO

  const setPusherSignInSuccess = () => {
    setUserSignedInToPusher(true);
  };

  const loadPusher = async () => {
    const { default: Pusher } = await import('pusher-js');

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
      pusher.unbind('pusher:signin_success', setPusherSignInSuccess);
      setPusher(null);
      setUserSignedInToPusher(false);
    };
  }

  useEffect(() => {
    if (!address) {
      return;
    }

    loadPusher()
      .catch(console.error);

  }, [address])

  // Whole site is currently password protected
  // @ts-ignore
  if (!pageProps.hasReadPermission) {
    // @ts-ignore
    return <ThemeProvider theme={theme}><LoginPage loggedIn={pageProps.hasReadPermission} /></ThemeProvider>
  }

  return (
    <CacheProvider value={emotionCache}>
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
                  hodlnotification: HodlNotificationSnackbar
                }}
              >
                <Layout 
                  address={address} 
                  pusher={pusher} 
                  userSignedInToPusher={userSignedInToPusher}
                >
                  <Component {...pageProps} />
                </Layout>
              </SnackbarProvider>
            </PusherContext.Provider>
          </WalletContext.Provider>
        </SWRConfig>
      </ThemeProvider>
    </CacheProvider>
  )
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)

  const cookies = new Cookies(appContext.ctx.req.headers.cookie)
  const password = cookies.get(process.env.NEXT_PUBLIC_HODL_MY_MOON_PASSWORD_COOKIE_NAME) ?? ""

  if (password === process.env.HODL_MY_MOON_PASSWORD) {
    appProps.pageProps.hasReadPermission = true
  }

  return { ...appProps }
}