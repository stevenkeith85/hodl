// import '../styles/globals.css'
import { createContext, useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import ResponsiveAppBar from '../components/AppBar';
import theme from '../theme';
import Footer from '../components/Footer';

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
  const [nickname, setNickname] = useState('');
  const [jwt, setJwt] = useState('');

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://res.cloudinary.com/" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito+Sans:300,400,500" />
      </Head>
      <CssBaseline />
      <WalletContext.Provider value={{ signer, setSigner, address, setAddress, nickname, setNickname, jwt, setJwt }}>
        <ThemeProvider theme={theme}>
          <Box sx={{
            minHeight: '100vh',
            position: 'relative',
            paddingBottom: { // for footer
              xs: '520px',
              md: '280px',
            },
            // webkitTapHighlightColor: 'transparent'
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
