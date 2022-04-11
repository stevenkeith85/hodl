import { Button, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { WalletContext } from "../pages/_app";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useRouter } from "next/router";
import { getShortAddress } from "../lib/utils";
import { HodlSnackbar } from '../components/HodlSnackbar'
import { useConnect } from "../hooks/useConnect";
import { NicknameModal } from "./NicknameModal";


export const ConnectButton = () => {
    const { signer, address, nickname } = useContext(WalletContext);
    const router = useRouter()
    const snackbarRef = useRef();
    
    const [connect, disconnect] = useConnect();
    
    const [settings] = useState([
        { label: 'Nickname', action: () => setNicknameModalOpen(true) },
        { label: 'Disconnect', action: () => disconnect() }
    ]);

    const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const buttonText = () => {
        if (nickname) {
            return nickname;
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
            if (localStorage.getItem('Wallet') === 'Connected') {
                connect();
            }
        };

        load();
    }, [])

    useEffect(() => {
        // @ts-ignore
        //snackbarRef?.current.display(`Nickname updated`, 'success');

        setNicknameModalOpen(false);
    }, [nickname])

    return (
        <>
           <HodlSnackbar ref={snackbarRef} />
           <NicknameModal nicknameModalOpen={nicknameModalOpen} setNicknameModalOpen={setNicknameModalOpen}></NicknameModal>

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