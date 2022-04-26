import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Container from '@mui/material/Container';
import { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { MobileMenu } from './MobileMenu';
import { AccountBalanceWallet, AccountCircle, Spa, Storefront } from '@mui/icons-material';
import { useConnect } from '../hooks/useConnect';
import { WalletContext } from '../contexts/WalletContext';
import { useNickname } from '../hooks/useNickname';


const ResponsiveAppBar = () => {
    const { address } = useContext(WalletContext);

    const router = useRouter();
    const [connect] = useConnect();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [pages] = useState([
        { 
            label: 'Market', 
            url: '/', 
            icon: <Storefront />, 
            publicPage: true 
        },
        { 
            label: 'Mint NFT', 
            url: '/mint', 
            icon: <Spa />, 
            publicPage: false 
        },
        { 
            label: 'My Profile', 
            url: `/profile`, 
            icon: <AccountCircle />, 
            publicPage: false 
        },
    ]);

    const [_update, _apiError, _setApiError, nickname] = useNickname()

    useEffect(() => {
        const load = async () => {
            if (localStorage.getItem('jwt')) {
                connect();
            }
        };

        load();
    }, [])

    return (
        <>
            <AppBar position="fixed" sx={{ maxWidth: `100vw`, left: 0 }}>
                <Container maxWidth="xl" sx={{ width: '100%', position: 'relative' }}>
                    <Toolbar disableGutters>
                        {/* Mobile */}
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, width: '100%', justifyContent: 'space-between' }}>
                            <MobileMenu
                                pages={pages}
                                mobileMenuOpen={mobileMenuOpen}
                                setMobileMenuOpen={setMobileMenuOpen}
                            />
                            <Logo />
                            <Box>
                                <IconButton
                                    size="large"
                                    onClick={() => setMobileMenuOpen(prev => !prev)}
                                    color="inherit"
                                >
                                    {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                                </IconButton>
                            </Box>
                        </Box>

                        {/* Desktop */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, width: '100%', justifyContent: 'space-between' }}>
                            <Stack direction="row" spacing={12} sx={{ alignItems: 'center' }}>
                                <Logo />
                                <Box sx={{
                                    display: 'grid',
                                    gap: 8,
                                    gridTemplateColumns: `repeat(3, minmax(0, 1fr))`,

                                }}>
                                    {pages.filter(p => p.publicPage || address).map(page => (
                                        <Link 
                                            key={page.url} 
                                            href={page.url === '/profile' ? `${page.url}/${nickname || address}`: page.url} 
                                            passHref
                                            >
                                            {router.asPath === page.url ?
                                                <Typography
                                                    key={page.label}
                                                    sx={{
                                                        display: 'block',
                                                        textAlign: 'center',
                                                        padding: 1,
                                                        cursor: 'pointer',
                                                        color: 'white',
                                                        textTransform: 'none',
                                                        fontSize: {
                                                            md: 16,
                                                        },
                                                        fontWeight: 900
                                                    }}
                                                >
                                                    {page.label}
                                                </Typography>
                                                : <Typography
                                                    key={page.label}
                                                    sx={{
                                                        display: 'block',
                                                        textAlign: 'center',
                                                        padding: 1,
                                                        cursor: 'pointer',
                                                        color: 'white',
                                                        textTransform: 'none',
                                                        fontSize: {
                                                            md: 16,
                                                        },
                                                        '&:hover': {
                                                            fontWeight: 900,
                                                        }
                                                    }}
                                                >
                                                    {page.label}
                                                </Typography>
                                            }
                                        </Link>
                                    ))}
                                </Box>
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
                            >
                                {mobileMenuOpen && <MobileMenu
                                    page={1}
                                    showBack={false}
                                    pages={pages}
                                    mobileMenuOpen={mobileMenuOpen}
                                    setMobileMenuOpen={setMobileMenuOpen}
                                />}
                                <IconButton
                                    size="large"
                                    onClick={() => setMobileMenuOpen(prev => !prev)}
                                    color="inherit"
                                    aria-label='Account Menu'
                                >
                                    {mobileMenuOpen ? <CloseIcon /> : <AccountBalanceWallet />}
                                </IconButton>
                            </Stack>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Toolbar disableGutters />
        </>
    );
};
export default ResponsiveAppBar;
