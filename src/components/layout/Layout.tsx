import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import dynamic from 'next/dynamic';

import Footer from './Footer';
import AppBar from './AppBar';

// const AppBar = dynamic(
//     () => import('./AppBar'),
//     { suspense: true }
// );

import { Suspense } from 'react';

export default function Layout({ children, address, pusher, userSignedInToPusher }) {
    return (
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
                <Suspense fallback={<div>Loading Header</div>}>
                    <AppBar 
                        // address={address} 
                        // pusher={pusher} 
                        // userSignedInToPusher={userSignedInToPusher} 
                        />
                </Suspense>
            </header>
            <main style={{ background: "#fcfcfc" }}>
                <Container maxWidth="xl">
                    {children}
                </Container>
            </main>
            <footer>
                <Suspense fallback={<div>Loading Footer</div>}>
                    <Footer 
                        // address={address} 
                    />
                </Suspense>
            </footer>
        </Box>
    )
}