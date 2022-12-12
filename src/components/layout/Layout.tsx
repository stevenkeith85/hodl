import Container from '@mui/material/Container';
import dynamic from 'next/dynamic';

import AppBarLoading from './AppBarLoading';
import Footer from './Footer';


export default function Layout({ children, address, pusher, userSignedInToPusher }) {

    const AppBar = dynamic(
        () => import('./AppBar'),
        {
            ssr: false,
            loading: () => <AppBarLoading address={address} />
        }
    );

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}>
            <header
                style={{
                    flexGrow: 0,
                    flexShrink: 0,
                    flexBasis: 'auto'
                }}>
                {/* @ts-ignore */}
                <AppBar address={address} pusher={pusher} userSignedInToPusher={userSignedInToPusher} />
            </header>
            <main
                style={
                    {
                        flexGrow: 1,
                        flexShrink: 0,
                        flexBasis: 'auto',
                        background: "#fcfcfc"
                    }}>
                <Container maxWidth="xl">
                    {children}
                </Container>
            </main>
            <footer
                style={{
                    flexGrow: 0,
                    flexShrink: 0,
                    flexBasis: 'auto'
                }}>
                <Footer address={address} />
            </footer>
        </div>
    )
}