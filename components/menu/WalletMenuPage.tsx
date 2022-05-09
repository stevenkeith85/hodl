import { DisplaySettings, CameraAlt, CloudOff, AccountBalanceWallet } from "@mui/icons-material";
import { Tooltip, Typography, Box, Stack, Link, Button } from "@mui/material";
import router from "next/router";
import { useContext, useState } from "react";
import { useConnect } from "../../hooks/useConnect";
import { useNickname } from "../../hooks/useNickname";
import { truncateText, getShortAddress } from "../../lib/utils";
import { WalletContext } from '../../contexts/WalletContext';

export const WalletMenuPage = ({ 
    // closeMenu, 
    setMenuPage, 
    setNicknameModalOpen, 
    setProfilePictureModalOpen, 
    showBack=true }) => {
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
        <Box sx={{
            padding: 2,
            // background: 'blue',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1
        }}>
            <Box sx={{
                flexGrow: 1,
                flexShrink: 0,
                flexBasis: 'auto',
            }}>
              {localStorage.getItem('jwt') && <Stack spacing={0} m={0} >
                    {walletPages.map((page, i) => (
                        <Stack
                            key={i}
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
                {
                    !localStorage.getItem('jwt') && 
                    <Box>
                        <Typography mb={2} variant="h1">Sign In</Typography>
                        <Typography mb={2} >Connect your wallet to access your account.</Typography>
                        <Typography>We officially support <Link href="https://metamask.io/download/">MetaMask</Link></Typography>
                        
                    </Box>}
            </Box>
            { showBack && <Button
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
            </Button>
            }
            {!showBack && <Button
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
                    <AccountBalanceWallet />
                    <Typography sx={{
                        fontSize: 16
                    }}>
                        {buttonText()}
                    </Typography>
                </Stack>
            </Button>}
        </Box>
    )
}
