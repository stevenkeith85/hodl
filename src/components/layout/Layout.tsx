import Container from '@mui/material/Container';
import ResponsiveAppBar from './AppBar';
import Footer from './Footer';

export default function Layout({ children, address }) {

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
                <ResponsiveAppBar address={address} />
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