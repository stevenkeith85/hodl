import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import dynamic from 'next/dynamic';
import { delayForDemo } from '../../lib/utils';

import AppBarLoading from './AppBarLoading';
import Footer from './Footer';


export default function Layout({ children, address, pusher, userSignedInToPusher }) {

    const AppBar = dynamic(
        // () => delayForDemo(import('./AppBar')),
        () => import('./AppBar'),
        {
            ssr: false,
            loading: () => <AppBarLoading address={address} />
        }
    );

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

                main: {
                    flexGrow: 1,
                    flexShrink: 0,
                    flexBasis: 'auto'
                },
                footer: {
                    flexGrow: 0,
                    flexShrink: 0,
                    flexBasis: 'auto'
                },
            }}>
            <header>
                {/* @ts-ignore */}
                <AppBar address={address} pusher={pusher} userSignedInToPusher={userSignedInToPusher} />
            </header>
            <main style={{ background: "#fcfcfc" }}>
                <Container maxWidth="xl">
                    {children}
                </Container>
            </main>
            <footer>
                <Footer />
            </footer>
        </Box>
    )
}