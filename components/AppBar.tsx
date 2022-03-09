import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useState, MouseEvent, useContext, useEffect } from 'react';
import { WalletContext } from '../pages/_app';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Link from 'next/link';
import { getProviderAndSigner } from '../lib/nft.js';
import { Logo } from './Logo';

import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { grey } from "@mui/material/colors";

// From MUI Docs
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

//



const ResponsiveAppBar = () => {
    const { wallet, setWallet, address, setAddress } = useContext(WalletContext);
    const router = useRouter();

    const [pages, setPages] = useState([
        { label: 'Market', url: '/' },
        { label: 'Mint NFT', url: '/mint' },
        { label: 'Profile', url: `/profile/${address}` },
    ]);

    const [settings] = useState([{
        label: 'Disconnect', action: () => null
    }]);

    useEffect(() => {
        if (address) {
            console.log('address changed to', address)
            setPages(old => {
                return old.map(({ label, url }) => {
                    if (label === 'Profile') {
                        return ({ label, url: `/profile/${address}` })
                    } else {
                        return ({ label, url })
                    }
                })
            });
        }
    }, [address]);

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const getShortAddress = () => {
        return address.slice(0, 2) + '...' + address.slice(-4);
    }

    useEffect(() => {
        const load = async () => {
            if (localStorage.getItem('Wallet') === 'Connected') {
                try {
                    const { provider, signer } = await getProviderAndSigner();
                    const walletAddress = await signer.getAddress();
                    setAddress(walletAddress);
                    setWallet({ provider, signer });
                } catch (e) {
                    console.log(e)
                }
            }
        };

        load();
    }, [])

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Mobile */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map(page => (
                                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                                    <Link href={page.url} passHref>
                                        <Typography component="a" sx={{
                                            color: grey[900],
                                            textDecoration: 'none',
                                            fontWeight: (theme) => router.asPath === page.url ? 900 : 300,
                                        }} >
                                            {page.label}
                                        </Typography>
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                    >
                        <Logo />
                    </Typography>

                    {/* Desktop */}
                    <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
                        <Logo />
                    </Typography>

                    <Box sx={{
                        flexGrow: 1,
                        alignItems: 'center',
                        display: {
                            xs: 'none',
                            md: 'flex'
                        },
                        justifyContent: {
                            md: 'left'
                        },
                        marginLeft: {
                            md: 2,
                            lg: 6
                        }
                    }}>
                        {pages.map(page => (
                            <>
                                <Link key={page.url} href={page.url} passHref>
                                    <Button
                                        component="a"
                                        key={page.label}
                                        onClick={handleCloseNavMenu}
                                        sx={{
                                            color: 'white',
                                            display: 'block',
                                            margin: '0 14px',
                                            textTransform: 'none',
                                            fontWeight: (theme) => router.asPath === page.url ? 900 : 300,
                                            fontSize: {
                                                md: 16,
                                            },
                                            '&:hover': {
                                                backgroundColor: (theme) => theme.palette.primary.light
                                            },
                                            textAlign: 'center'
                                        }}
                                    >
                                        {page.label}
                                    </Button>
                                </Link></>
                        ))}
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                        </Box>


                        <IconButton onClick={async e => {
                            if (wallet.signer) {
                                handleOpenUserMenu(e);
                            } else {
                                try {
                                    const { provider, signer } = await getProviderAndSigner();
                                    const walletAddress = await signer.getAddress();
                                    setAddress(walletAddress);
                                    setWallet({ provider, signer });
                                    localStorage.setItem('Wallet', 'Connected');
                                } catch (e) {
                                    console.log(e)
                                }

                            }
                        }}
                        >
                            <Avatar variant="rounded" sx={{
                                bgcolor: 'secondary.main',
                                width: 120,
                                padding: 2,
                                fontSize: 14,
                                fontWeight: 600,
                                border: (theme) => `1px solid ${theme.palette.secondary.light}`,
                                '&:hover': {
                                    backgroundColor: (theme) => theme.palette.secondary.dark
                                }
                            }}>
                                <AccountBalanceWalletIcon sx={{ marginRight: 1 }} />
                                {wallet.signer ? getShortAddress() : 'Connect'}
                            </Avatar>
                        </IconButton>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map(setting => (
                                <MenuItem key={setting.label} onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center" onClick={() => {
                                        setWallet({ provider: null, signer: null });
                                        localStorage.setItem('Wallet', 'Not Connected');
                                    }}
                                    >
                                        {setting.label}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;
