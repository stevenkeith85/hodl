import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useState, MouseEvent, useContext, useEffect } from 'react';
import { WalletContext } from '../pages/_app';
import Link from 'next/link';
import { Logo } from './Logo';

import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { grey } from "@mui/material/colors";
import { ConnectButton } from './ConnectButton';


// From MUI Docs
// const Search = styled('div')(({ theme }) => ({
//     position: 'relative',
//     borderRadius: theme.shape.borderRadius,
//     backgroundColor: alpha(theme.palette.common.white, 0.15),
//     '&:hover': {
//         backgroundColor: alpha(theme.palette.common.white, 0.25),
//     },
//     marginLeft: 0,
//     width: '100%',
//     [theme.breakpoints.up('sm')]: {
//         marginLeft: theme.spacing(1),
//         width: 'auto',
//     },
// }));

// const SearchIconWrapper = styled('div')(({ theme }) => ({
//     padding: theme.spacing(0, 2),
//     height: '100%',
//     position: 'absolute',
//     pointerEvents: 'none',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//     color: 'inherit',
//     '& .MuiInputBase-input': {
//         padding: theme.spacing(1, 1, 1, 0),
//         // vertical padding + font size from searchIcon
//         paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//         transition: theme.transitions.create('width'),
//         width: '100%',
//         [theme.breakpoints.up('sm')]: {
//             width: '12ch',
//             '&:focus': {
//                 width: '20ch',
//             },
//         },
//     },
// }));

const ResponsiveAppBar = () => {
    const { address, nickname } = useContext(WalletContext);
    const router = useRouter();

    const [pages, setPages] = useState([
        { label: 'Market', url: '/' },
        { label: 'Mint NFT', url: '/mint' },
        { label: 'My Profile', url: `/profile/${nickname || address}` },
    ]);

    useEffect(() => {
        if (address) {
            setPages(old => {
                return old.map(({ label, url }) => {
                    if (label === 'My Profile') {
                        return ({ label, url: `/profile/${nickname || address}` })
                    } else {
                        return ({ label, url })
                    }
                })
            });
        }
    }, [address, nickname]);

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <>
        <AppBar position="fixed">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Mobile */}
                    <Box sx={{  display: { xs: 'flex', md: 'none' }, width: '100%', justifyContent: 'space-between'}}>
                        <Logo />
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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
                                <ConnectButton />
                            </Menu>
                        </Box>
                    </Box>


                    {/* Desktop */}
                    <Box sx={{ display: { xs: 'none', md: 'flex'}, width: '100%', justifyContent: 'space-between'}}>
                    <Stack direction="row" spacing={12} sx={{alignItems: 'center'}}>
                        <Logo />
                        <Box sx={{
                            display: 'grid',
                            gap: 6,
                            gridTemplateColumns: `repeat(3, minmax(0, 1fr))`,

                        }}>
                            {pages.map(page => (
                                    <Link key={page.url} href={page.url} passHref>
                                        {router.asPath === page.url ?
                                            <Typography
                                                key={page.label}
                                                onClick={handleCloseNavMenu}
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
                                                onClick={handleCloseNavMenu}
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
                        {/* <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search> */}
                        <ConnectButton />
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
