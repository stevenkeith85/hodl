import { useTheme } from '@mui/material/styles';
import { Box, Container, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { HodlButton } from "./HodlButton";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useContext, useEffect, useState } from "react";
import { CameraAlt, CloudOff, DisplaySettings } from "@mui/icons-material";
import { useNickname } from "../hooks/useNickname";
import { WalletContext } from "../pages/_app";
import { getShortAddress, truncateText } from "../lib/utils";
import { useConnect } from "../hooks/useConnect";
import { NicknameModal } from "./modals/NicknameModal";
import { ProfilePictureModal } from "./ProfilePictureModal";


const WalletMenuPage = ({ closeMenu, setMenuPage, setNicknameModalOpen, setProfilePictureModalOpen, showBack=true }) => {
    const [connect, disconnect] = useConnect();
    const [_update, _apiError, _setApiError, nickname] = useNickname();
    const { signer, address } = useContext(WalletContext);

    const buttonText = () => {
        if (nickname) {
            return <Tooltip title={nickname}><Typography>{truncateText(nickname, 20)}</Typography></Tooltip>
        } else if (address) {
            return <Tooltip title={address}><Typography>{getShortAddress(address).toLowerCase()}</Typography></Tooltip>
        } else {
            return 'Connect';
        }
    }

    const [walletPages] = useState([
        { label: 'Nickname', action: () => setNicknameModalOpen(true), icon: <DisplaySettings /> },
        { label: 'Profile NFT', action: () => setProfilePictureModalOpen(true), icon: <CameraAlt /> },
        { label: 'Disconnect', action: () => disconnect(), icon: <CloudOff /> },
    ]);

    
    const isMobileDevice = () => {
        return 'ontouchstart' in window || 'onmsgesturechange' in window;
    }

    const connectMobile = () => {
        router.push("https://metamask.app.link/dapp/192.168.1.242:3001/");
    }

    return (
        <>
            <Box sx={{
                flexGrow: 1,
                flexShrink: 0,
                flexBasis: 'auto'
            }}>
              {address && <Stack spacing={0} m={0} >
                    {walletPages.map(page => (
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                '&:hover': {
                                    cursor: 'pointer',
                                    color: theme => theme.palette.secondary.main,
                                }
                            }}
                            onClick={(e) => {
                                e.stopPropagation(),
                                page.action();
                            }}
                        >
                            {page.icon}
                            <Typography
                                component="a"
                                sx={{
                                    fontSize: 16,
                                    textDecoration: 'none',
                                    padding: 2,

                                }} >
                                {page.label}
                            </Typography>

                        </Stack>
                    ))}
                </Stack>}
                {!address && <Stack spacing={2}><Typography variant="h1">Connect Your Wallet</Typography><Typography>Please connect your wallet to access your account.</Typography></Stack>}
            </Box>
            { showBack && <HodlButton
                color="secondary"
                onClick={(e) => {
                    e.stopPropagation();
                    setMenuPage(0)
                }}
                sx={{
                    flexGrow: 0,
                    flexShrink: 0,
                    flexBasis: 'auto'
                }}
            >Back
            </HodlButton>
            }
            {!showBack && <HodlButton
                color="secondary"
                onClick={(e) => {
                    e.stopPropagation();

                    if (isMobileDevice()) {
                        connectMobile();
                    } else {
                        connect(false);
                    }
                }}
                sx={{
                    flexGrow: 0,
                    flexShrink: 0,
                    flexBasis: 'auto',
                }}
            >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <AccountBalanceWalletIcon />
                    <Typography sx={{
                        fontSize: 16
                    }}>
                        {buttonText()}
                    </Typography>
                </Stack>
            </HodlButton>}
        </>
    )
}

const MainMenuPage = ({ pages, closeMenu, router, setMenuPage }) => {
    const [_update, _apiError, _setApiError, nickname] = useNickname();
    const { signer, address } = useContext(WalletContext);
    const [connect] = useConnect();

    const buttonText = () => {
        if (nickname) {
            return <Tooltip title={nickname}><Typography>{truncateText(nickname, 20)}</Typography></Tooltip>
        } else if (address) {
            return <Tooltip title={address}><Typography>{getShortAddress(address).toLowerCase()}</Typography></Tooltip>
        } else {
            return 'Connect';
        }
    }


    const isMobileDevice = () => {
        return 'ontouchstart' in window || 'onmsgesturechange' in window;
    }

    const connectMobile = () => {
        router.push("https://metamask.app.link/dapp/192.168.1.242:3001/");
    }

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
            <Box sx={{
                flexGrow: 1,
                flexShrink: 0,
                flexBasis: 'auto'
            }}>
                <Stack spacing={0} m={0}>
                    {pages.map(page => (
                        <Link href={page.url} passHref>
                            <Stack
                                direction="row"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&:hover': {
                                        cursor: 'pointer',
                                        color: theme => theme.palette.secondary.main,
                                    }
                                }}>
                                {page.icon}
                                <Typography
                                    component="a"
                                    onClick={closeMenu}
                                    sx={{
                                        fontSize: 16,
                                        textDecoration: 'none',
                                        fontWeight: (theme) => router.asPath === page.url ? 900 : 300,
                                        padding: 2,
                                    }} >
                                    {page.label}
                                </Typography>
                            </Stack>
                        </Link>

                    ))}
                </Stack>
            </Box>
            <HodlButton
                color="secondary"
                onClick={(e) => {
                    e.stopPropagation();
                    if (signer) {
                        setMenuPage(1);
                    } else if (isMobileDevice()) {
                        connectMobile();
                    }
                    else {
                        connect(false);
                    }
                }
                }
                sx={{
                    flexGrow: 0,
                    flexShrink: 0,
                    flexBasis: 'auto',
                }}
            >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <AccountBalanceWalletIcon />
                    <Typography sx={{
                        fontSize: 16
                    }}>
                        {buttonText()}
                    </Typography>
                </Stack>
            </HodlButton>
        </>
    )
}

export const MobileMenu = ({ pages, mobileMenuOpen, setMobileMenuOpen, page=0, showBack=true}) => {
    const router = useRouter();

    const [menuPage, setMenuPage] = useState(page);

    const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
    const [profilePictureModalOpen, setProfilePictureModalOpen] = useState(false);

    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.only('xs'));

    // useEffect(() => {
    //     setMenuPage(0);
    // }, [mobileMenuOpen]);

    const closeMenu = () => {
        setMobileMenuOpen(false)

    }

    return (
        <>
            <NicknameModal nicknameModalOpen={nicknameModalOpen} setNicknameModalOpen={setNicknameModalOpen}></NicknameModal>
            <ProfilePictureModal profilePictureModalOpen={profilePictureModalOpen} setProfilePictureModalOpen={setProfilePictureModalOpen}></ProfilePictureModal>

            <Box sx={{
                position: 'fixed',
                left: 0,
                background: { xs: 'white', sm: 'none' },
                opacity: 1,
                color: theme => theme.palette.primary.dark,
                height: { xs: `calc(100% - 56px)`, sm: '100%' },
                width: { xs: '100%' },
                top: '56px',
                animation: mobileMenuOpen ? `${xs ? 'slidein' : 'fadeIn'} 0.5s forwards` : `${xs ? 'slideout' : 'fadeOut'} 0.5s forwards`,
                zIndex: 100,
                padding: 0
            }}
                onClick={closeMenu}
            >
                <Container maxWidth="xl" sx={{ height: '100%' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: { xs: 0, sm: '50%', md: '66%' },
                            background: 'white',
                            border: { xs: 'none', sm: `1px solid #f0f0f0` },
                            borderTop: 'none',
                            padding: 2,
                            pointerEvents: 'auto',
                            height: { xs: '100%', sm: `33%` },
                            minHeight: '400px',
                        }}>

                        {menuPage === 0 && <MainMenuPage closeMenu={closeMenu} pages={pages} router={router} setMenuPage={setMenuPage} />}
                        {menuPage === 1 && <WalletMenuPage
                            setNicknameModalOpen={setNicknameModalOpen}
                            setProfilePictureModalOpen={setProfilePictureModalOpen}
                            closeMenu={closeMenu}
                            setMenuPage={setMenuPage}
                            showBack={showBack}
                        />}
                    </Box>
                </Container>

            </Box>
        </>
    )
}