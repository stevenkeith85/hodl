import { Box, Container } from '@mui/material'
import { useRouter } from 'next/router'
import ResponsiveAppBar from './AppBar'
import Footer from './Footer'

export default function Layout({ children }) {

    const router = useRouter();

    return (
        <>
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
                    <ResponsiveAppBar />
                </header>
                <main>
                    {router.asPath !== '/' && <Container maxWidth="xl">
                        {children}
                    </Container>
                    }
                    {router.asPath === '/' && <>
                        {children}
                    </>
                    }
                </main>
                <footer>
                    <Footer />
                </footer>
            </Box>
        </>
    )
}