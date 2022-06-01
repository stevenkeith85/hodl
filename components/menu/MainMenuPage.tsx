import { AccountCircle, ArrowRightAlt, ChevronRightOutlined } from "@mui/icons-material";
import { Typography, Box, Stack, ClickAwayListener, useTheme, useMediaQuery } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { WalletContext } from '../../contexts/WalletContext';
import { SearchBox } from "../Search";


export const MainMenuPage = ({
    pages,
    hoverMenuOpen,
    setHoverMenuOpen,
    setMenuPage
}) => {
    const { address } = useContext(WalletContext);
    const router = useRouter();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    const handleRouteChange = () => {
        if (hoverMenuOpen) {
            setHoverMenuOpen(false)
        }
    }

    useEffect(() => {
        console.log('main menu route change')
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
          router.events.off('routeChangeComplete', handleRouteChange)
        };
            
      }, [router.events]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            <Box sx={{ flexGrow: 1, }}>
                <ClickAwayListener 
                    onClickAway={e => { 
                        e.stopPropagation();
                        if (hoverMenuOpen) {
                            setHoverMenuOpen(false)
                        }
                        
                    }} touchEvent={false}>
                    <Stack spacing={0}>
                        {matches && <Box
                            sx={{
                                borderBottom: '1px solid #f0f0f0',
                                paddingBottom: 2,
                                marginBottom: 2
                            }}>
                            <SearchBox
                                setHoverMenuOpen={setHoverMenuOpen}
                            />
                        </Box>
                        }
                        {pages.filter(p => p.publicPage || address).map((page, i) => (
                            <Link key={i} href={page.url} passHref>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    sx={{
                                        color: '#666',
                                        '&:hover': {
                                            cursor: 'pointer',
                                            color: theme => theme.palette.secondary.main,
                                        },
                                        borderBottom: '1px solid #f0f0f0',
                                        paddingBottom: 2,
                                        marginBottom: 2
                                    }}>
                                    {page.icon}
                                    <Typography
                                        component="a"
                                        sx={{
                                            textDecoration: 'none',
                                            fontWeight: router.asPath === page.url ? 900 : 300,
                                            marginLeft: 1,
                                        }} >
                                        {page.label}
                                    </Typography>
                                </Box>
                            </Link>
                        ))}
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{
                                color: '#666',
                                '&:hover': {
                                    cursor: 'pointer',
                                    color: theme => theme.palette.secondary.main,
                                }
                            }}
                            onClick={e => {
                                e.stopPropagation();
                                setMenuPage(1)
                            }}
                        >
                            <Box
                                flexGrow="1"
                                display="flex"
                                alignItems="center">
                                <AccountCircle />
                                <Typography
                                    component="a"
                                    sx={{
                                        textDecoration: 'none',
                                        marginLeft: 1,
                                    }} >
                                    Account
                                </Typography>
                            </Box>
                            <ChevronRightOutlined />
                        </Box>
                    </Stack>
                </ClickAwayListener>
            </Box>
        </Box>

    )
}
