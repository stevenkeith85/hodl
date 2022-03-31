import { Avatar, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { WalletContext } from "../pages/_app";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { getMetaMaskSigner } from "../lib/connections";
import { useRouter } from "next/router";
import { getShortAddress, trim } from "../lib/utils";
import { HodlButton } from "./HodlButton";
import { HodlModal } from "./HodlModal";
import { HodlTextField } from "./HodlTextField";
import { RocketTitle } from "./RocketTitle";
import { HodlSnackbar } from '../components/HodlSnackbar'


export const ConnectButton = () => {
    const { wallet, setWallet, address, setAddress, nickname, setNickname } = useContext(WalletContext);
    const router = useRouter()
    const snackbarRef = useRef();

    const [settings] = useState([
        { label: 'Set Nickname', action:() => setNicknameModalOpen(true) },
        { label: 'Disconnect', action: () => disconnect()}
    ]);

    const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
    const [desiredNickname, setDesiredNickname] = useState('');

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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
            
            const r = await fetch(`/api/nickname?address=${walletAddress}`);
            const json = await r.json();

            setAddress(walletAddress);
            setNickname(json.nickname);
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
        setNickname('');
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
        <HodlSnackbar ref={snackbarRef} />
        
            <HodlModal
                open={nicknameModalOpen}
                setOpen={setNicknameModalOpen}
      >
        <Stack spacing={4}>
          <RocketTitle title="Nickname" />
          <Typography sx={{ paddingLeft: 1 }}>
            Wallet addresses are hard to remember. Use a nickname instead.
          </Typography>
          <Typography sx={{ paddingLeft: 1 }}>
            You can change this at any time.
          </Typography>
          <HodlTextField
            label="Nickname"
            value={desiredNickname}
            onInput={() => setError(false)}
            onChange={e => setDesiredNickname(e.target.value)}
            required
            error={error}
            helperText={ error && errorMessage}
          />
          <HodlButton
            onClick={async () => {
              try {
                const response = await fetch('/api/nickname', {
                    method: 'POST',
                    headers: new Headers({
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                    }),
                    body: JSON.stringify({ 
                      address: address,
                      nickname: trim(desiredNickname).toLowerCase()
                    })
                  });
                  const {set, message } = await response.json();
                  if (set) {
                    // @ts-ignore
                    snackbarRef?.current.display(message, 'success');
                    setNickname(desiredNickname);
                    setNicknameModalOpen(false);
                  } else {
                    // @ts-ignore
                    setError(true);
                    setErrorMessage(message);
                  }
                  
              } catch (e) {
                console.log(e)
              }

            }}
          >
            Set
          </HodlButton>
        </Stack>
      </HodlModal>
      
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
                    
                }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <AccountBalanceWalletIcon />
                        { nickname ? 
                        <Typography>{nickname}</Typography>
                        : <Typography sx={{ lineHeight: '14px',fontWeight: 500 }}>{ wallet.signer ? getShortAddress(address).toLowerCase() : 'Connect' }</Typography>
                        }
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
                        <Typography textAlign="center" onClick={setting.action}>
                            {setting.label}
                        </Typography>
                    </MenuItem>

                ))}
            </Menu>
        </>
    )
}