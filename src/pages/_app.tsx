import { useEffect, useState } from 'react';

import Head from 'next/head';
import App, { AppProps } from 'next/app';
import dynamic from "next/dynamic";

import { Analytics } from '@vercel/analytics/react';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { SnackbarProvider } from 'notistack';
import { SWRConfig } from 'swr'
import { CacheProvider, EmotionCache } from '@emotion/react';
import cookie from 'cookie'
import '../styles/globals.css'
import { PusherContext } from '../contexts/PusherContext';
import { WalletContext } from '../contexts/WalletContext';
import { FeedContext } from '../contexts/FeedContext';
import { useActions2 } from '../hooks/useActions2';
import { ActionSet } from '../models/HodlAction';

import { HodlNotificationSnackbar } from '../components/snackbars/HodlNotificationSnackbar';

const LoginPage = dynamic(
  () => import('./login'),
  {
    ssr: false,
    loading: () => null
  }
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

  const feed = useActions2(props?.pageProps?.address, ActionSet.Feed);
  
  // Staging is password protected. Will switch this to staging
  // @ts-ignore
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' && !pageProps.hasReadPermission) {
    // @ts-ignore
    return <ThemeProvider theme={theme}><LoginPage {...pageProps} /></ThemeProvider>
  }

  return (
    <>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SWRConfig value={{
            dedupingInterval: 2000, // default
            focusThrottleInterval: 5000, // default
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
                  <FeedContext.Provider value={{ feed }}>
                  <Layout
                    address={address}
                    pusher={pusher}
                    userSignedInToPusher={userSignedInToPusher}
                  >
                    <Component {...pageProps} />
                  </Layout>
                  </FeedContext.Provider>
                </SnackbarProvider>
              </PusherContext.Provider>
            </WalletContext.Provider>
          </SWRConfig>
        </ThemeProvider>
      </CacheProvider>
      <Analytics /></>
  )
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)

  const cookies = cookie.parse(appContext?.ctx?.req?.headers?.cookie ?? "");
  const password = cookies[process.env.NEXT_PUBLIC_HODL_MY_MOON_PASSWORD_COOKIE_NAME] ?? ""

  if (password === process.env.HODL_MY_MOON_PASSWORD) {
    appProps.pageProps.hasReadPermission = true
  }

  return { ...appProps }
}
