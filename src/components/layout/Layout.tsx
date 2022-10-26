import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { useRouter } from 'next/router'

import dynamic from "next/dynamic";

// const AppBar = dynamic(
//     () => import('./AppBar'),
//     {
//         ssr: false,
//     }
// );

const Footer = dynamic(
    () => import('./Footer'),
);


export default function Layout({ children }) {
    console.log('Layout');
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
                    {/* <AppBar /> */}
                </header>
                <main
                    style={{
                            background: "#fcfcfc"
                        }}>
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