import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import Footer from './Footer';
import AppBar from './AppBar';

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
                <AppBar address={address} pusher={pusher} userSignedInToPusher={userSignedInToPusher} />
            </header>
            <main style={{ background: "#fcfcfc" }}>
                <Container maxWidth="xl">
                    {children}
                </Container>
            </main>
            <footer>
                <Footer address={address} />
            </footer>
        </Box>
    )
}