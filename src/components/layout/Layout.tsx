import { Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import dynamic from 'next/dynamic';
import { Suspense, lazy, useState } from 'react';
import { delayForDemo } from '../../lib/utils';
import Footer from './Footer';
// import AppBar from './AppBar';





// const AppBar = lazy(() => delayForDemo(import('./AppBar')));

const HeaderLoading = ({ }) => (
    <Container
        maxWidth="xl"
        sx={{
            width: '100%',
            position: 'relative'
        }}>
        <Box
            sx={{
                padding: 1,
                display: 'flex',
                justifyContent: 'space-between',
                height: '64px'
            }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 5
            }}>
                <Skeleton variant="circular" width={30} height={30} animation="wave" />
                <Skeleton variant="text" width={55} height={30} animation="wave" />
            </Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 4
            }}>
                <Skeleton variant="text" width={160} height={60} animation="wave" />
                <Skeleton variant="circular" width={30} height={30} animation="wave" />

            </Box>
        </Box>
    </Container>
)
const AppBar = dynamic(
    () => delayForDemo(import('./AppBar')),
    {
        ssr: false,
        loading: () => <HeaderLoading />
    }
);


export default function Layout({ children, address, pusher, userSignedInToPusher }) {

    const [showHeader, setShowHeader] = useState(false);

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
                {/* <label>
                    <input type="checkbox" checked={showHeader} onChange={e => setShowHeader(e.target.checked)} />
                    Show header
                </label> */}
                {/* {showHeader && */}

                <AppBar
                // address={address} 
                // pusher={pusher} 
                // userSignedInToPusher={userSignedInToPusher} 
                />
                {/* } */}
            </header>
            <main style={{ background: "#fcfcfc" }}>
                <Container maxWidth="xl">
                    {children}
                </Container>
            </main>
            <footer>
                {/* <Suspense fallback={<div>Loading...</div>}> */}
                <Footer
                // address={address} 
                />
                {/* </Suspense> */}
            </footer>
        </Box>
    )
}