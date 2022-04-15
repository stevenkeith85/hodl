import { Button, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { WalletContext } from "../pages/_app";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useRouter } from "next/router";
import { getShortAddress, truncateText} from "../lib/utils";
import { HodlSnackbar } from '../components/HodlSnackbar'
import { useConnect } from "../hooks/useConnect";
import { NicknameModal } from "./modals/NicknameModal";
import { ProfilePictureModal } from "./ProfilePictureModal";
import useSWR from "swr";
import { useNickname } from "../hooks/useNickname";


export const ConnectButton = () => {
    const { signer, address } = useContext(WalletContext);
    const router = useRouter()

    const [connect, disconnect] = useConnect();

    const [settings] = useState([
        { label: 'Nickname', action: () => setNicknameModalOpen(true) },
        { label: 'Profile NFT', action: () => setProfilePictureModalOpen(true) },
        { label: 'Disconnect', action: () => disconnect() }
    ]);

    const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
    const [profilePictureModalOpen, setProfilePictureModalOpen] = useState(false);
    
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const [_update, _apiError, _setApiError, nickname] = useNickname();

    const buttonText = () => {
        if (nickname) {
            return truncateText(nickname, 20);
        } else if (address) {
            return getShortAddress(address).toLowerCase();
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
            <NicknameModal nicknameModalOpen={nicknameModalOpen} setNicknameModalOpen={setNicknameModalOpen}></NicknameModal>
            <ProfilePictureModal profilePictureModalOpen={profilePictureModalOpen} setProfilePictureModalOpen={setProfilePictureModalOpen}></ProfilePictureModal>

            <Button
                color="secondary"
                variant="contained"
                onClick={e => {
                    if (signer) {
                        handleOpenUserMenu(e);
                    } else if (isMobileDevice()) {
                        connectMobile();
                    }
                    else {
                        connect(false);
                    }
                }
                }
            >
                {
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <AccountBalanceWalletIcon />
                        <Typography>{buttonText()}</Typography>
                    </Stack>
                }
            </Button>
            <Menu
                sx={{
                    mt: '45px'
                }}
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
                    <MenuItem
                        key={setting.label}
                        onClick={() => {
                            setting.action();
                            handleCloseUserMenu();
                        }}>
                        <Typography textAlign="center">{setting.label}</Typography>
                    </MenuItem>

                ))}
            </Menu>
        </>
    )
}