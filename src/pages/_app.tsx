import { useEffect, useState } from 'react';

import Head from 'next/head';
import App, { AppProps } from 'next/app';
import dynamic from "next/dynamic";

import { Analytics } from '@vercel/analytics/react';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { SnackbarProvider } from 'notistack';
import { SWRConfig } from 'swr'
import { 
  CacheProvider, 
  EmotionCache 
} from '@emotion/react';

import cookie from 'cookie'

import '../styles/globals.css'

import { PusherContext } from '../contexts/PusherContext';
import { WalletContext } from '../contexts/WalletContext';

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

import { SignedInContext } from '../contexts/SignedInContext';
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
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  // SignedInContext state
  const [signedInAddress, setSignedInAddress] = useState(null);

  // PusherContext state
  const [pusher, setPusher] = useState(null);
  const [userSignedInToPusher, setUserSignedInToPusher] = useState(false); // TODO

  useEffect(() => {
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

    if (!signedInAddress) {
      return;
    }

    loadPusher().catch(console.error);

  }, [signedInAddress])


  // We reconnect the wallet in the app bar, as that has access to the context
  useEffect(() => {
    if (props?.pageProps?.address && !signedInAddress) {
      setSignedInAddress(props?.pageProps?.address);
    }
  }, [props?.pageProps?.address])

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
            dedupingInterval: 10000, // default is 2000. This is a little higher incase we have multiple hooks on the same page asking for the same thing. 10 seconds should be long enough for a page load.
            focusThrottleInterval: 10000, // default is 5000. this is how many seconds user needs to focussed in another window before we'd revalidate on focus
            errorRetryCount: 0
          }}>
            <WalletContext.Provider value={{
              provider,
              setProvider,
              signer,
              setSigner,
              walletAddress,
              setWalletAddress,
            }}>
              <SignedInContext.Provider value={{
                signedInAddress,
                setSignedInAddress
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
                      address={signedInAddress}
                      >
                      <Component {...pageProps} />
                    </Layout>
                  </SnackbarProvider>
                </PusherContext.Provider>
              </SignedInContext.Provider>
            </WalletContext.Provider>
          </SWRConfig>
        </ThemeProvider>
      </CacheProvider>
      <Analytics />
    </>
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


// TODO
// provider.on("network", async (newNetwork, oldNetwork) => {
//   // When a Provider makes its initial connection, it emits a "network"
//   // event with a null oldNetwork along with the newNetwork. So, if the
//   // oldNetwork exists, it represents a changing network

//   const switchIfOnUnsupportedNetwork = async () => {
//     const switchToPolygon = await import('../lib/switchToPolygon').then(mod => mod.switchToPolygon);
//     const chains = await import('../lib/chains').then(mod => mod.chains);
//     const enqueueSnackbar = await import('notistack').then(mod => mod.enqueueSnackbar);

//     provider?.getNetwork()
//       .then(network => chains[network?.name])
//       .then(chain => {
//         if (!chain) {
//           enqueueSnackbar(`Switching Networks. You may need to approve in your wallet.`, {
//             // @ts-ignore
//             variant: 'info',
//           });
//           switchToPolygon(provider);
//         } else {
//           enqueueSnackbar(`Connected to ${chain.chainName}`, {
//             // @ts-ignore
//             variant: 'info',
//           });
//         }
//       })
//   }
//   await switchIfOnUnsupportedNetwork();
// });
