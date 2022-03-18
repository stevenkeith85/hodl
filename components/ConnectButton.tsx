import { Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { WalletContext } from "../pages/_app";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { getProviderAndSigner } from "../lib/nft";
import { useRouter } from "next/router";


export const ConnectButton = () => {
    const { wallet, setWallet, address, setAddress } = useContext(WalletContext);
    const router = useRouter()

    const [settings] = useState([{
        label: 'Disconnect', action: () => null
    }]);

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const getShortAddress = () => {
        return address.slice(0, 2) + '...' + address.slice(-4);
    }

    const isMobileDevice = () => {
        return 'ontouchstart' in window || 'onmsgesturechange' in window;
    }

    const connectMobile = () => {
        router.push("https://metamask.app.link/dapp/192.168.1.242:3001/");
    }

    const connect = async () => {
        try {            
            const { provider, signer } = await getProviderAndSigner();
            const walletAddress = await signer.getAddress();

            setAddress(walletAddress);
            console.log('connected to ', walletAddress);
            setWallet({ provider, signer });

            localStorage.setItem('Wallet', 'Connected');
        } catch (e) {
            console.log(e)
        }
    }

    const disconnect = async () => {
        setAddress('');
        setWallet({ provider: null, signer: null });
        localStorage.setItem('Wallet', 'Not Connected');
    }

    useEffect(() => {
        const load = async () => {
            if (isMobileDevice() || localStorage.getItem('Wallet') === 'Connected') {
                connect();
            }
        };

        load();
    }, [])


    return (
        <>
            <IconButton
                sx={{ display: { xs: 'flex' } }}
                onClick={async e => {
                    if (wallet.signer) {
                        handleOpenUserMenu(e);
                    } else if (isMobileDevice()) {
                        connectMobile();
                    } else {
                        connect();
                    }
                }}
            >
                <Avatar 
                variant="rounded" 
                sx={{
                    bgcolor: 'secondary.main',
                    width: 120,
                    padding: 2,
                    fontSize: 14,
                    fontWeight: 500,
                    border: (theme) => `1px solid ${theme.palette.secondary.light}`,
                    '&:hover': {
                        backgroundColor: (theme) => theme.palette.secondary.dark
                    }
                }}>
                    <AccountBalanceWalletIcon sx={{ marginRight: 1 }} />
                    {
                        wallet.signer ? getShortAddress() : 'Connect'
                    }
                </Avatar>
            </IconButton>
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
                    <MenuItem key={setting.label} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center" onClick={() => disconnect()}>
                            {setting.label}
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}