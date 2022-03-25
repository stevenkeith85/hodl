import { Avatar, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { WalletContext } from "../pages/_app";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { getMetaMaskSigner } from "../lib/connections";
import { useRouter } from "next/router";
import { getShortAddress } from "../lib/utils";


export const ConnectButton = () => {
    const { wallet, setWallet, address, setAddress } = useContext(WalletContext);
    const router = useRouter()

    const [settings] = useState([{
        label: 'Disconnect', action: () => null
    }]);

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const isMobileDevice = () => {
        return 'ontouchstart' in window || 'onmsgesturechange' in window;
    }

    const connectMobile = () => {
        router.push("https://metamask.app.link/dapp/192.168.1.242:3001/");
    }

    const connect = async () => {
        try {            
            const signer = await getMetaMaskSigner();
            const walletAddress = await signer.getAddress();

            setAddress(walletAddress);
            console.log('address set to', walletAddress)

            setWallet({ provider: null, signer });

            localStorage.setItem('Wallet', 'Connected');

            // need to think about this
            //router.push('/profile/' + walletAddress);
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
            if (localStorage.getItem('Wallet') === 'Connected') {
                connect();
            }
        };

        load();
    }, [])


    return (
        <>
            <IconButton
                sx={{ 
                    display: { 
                        xs: 'flex' 
                    },
                    
                    '&:hover': {
                        '.avatar': {
                            bgcolor: 'white',
                            color: 'secondary.main',
                            border: `3px solid secondary.main`,
                        }
                        
                    }
                }}
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
                className="avatar"
                sx={{
                    bgcolor: 'secondary.main',
                    width: 120,
                    padding: 2,
                    fontSize: 14,
                    fontWeight: 500,
                    // border: (theme) => `1px solid ${theme.palette.secondary.light}`,
                    
                }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <AccountBalanceWalletIcon />
                        <Typography sx={{ lineHeight: '14px',fontWeight: 500 }}>{ wallet.signer ? getShortAddress(address).toLowerCase() : 'Connect' }</Typography>
                    </Stack>
                    
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