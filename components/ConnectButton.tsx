import { Avatar, Button, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { WalletContext } from "../pages/_app";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { getMetaMaskSigner } from "../lib/connections";
import { useRouter } from "next/router";
import { getShortAddress, messageToSign, trim } from "../lib/utils";
import { HodlButton } from "./HodlButton";
import { HodlModal } from "./HodlModal";
import { HodlTextField } from "./HodlTextField";
import { RocketTitle } from "./RocketTitle";
import { HodlSnackbar } from '../components/HodlSnackbar'


export const ConnectButton = () => {
    const { signer, setSigner, address, setAddress, nickname, setNickname, jwt, setJwt} = useContext(WalletContext);
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

    const buttonText = () => {
        if (nickname) {
            return nickname;
        } else if (address) {
            return getShortAddress(address).toLowerCase();
        } else {
            return 'CONNECT WITH METAMASK';
        }
    }

    const isMobileDevice = () => {
        return 'ontouchstart' in window || 'onmsgesturechange' in window;
    }

    const connectMobile = () => {
        router.push("https://metamask.app.link/dapp/192.168.1.242:3001/");
    }

    const connect = async (returningUser=true) => {
        try {            
            const _signer = await getMetaMaskSigner(returningUser);
            const _address = await _signer.getAddress();

            if (!returningUser) {
                // get nonce
                const rNonce = await fetch(`/api/nonce?address=${_address}`);
                const { nonce } = await rNonce.json();
                
                // get user to sign message + nonce
                const signature = await _signer.signMessage(messageToSign + nonce);
                
                // send the sign to the BE
                const rSig = await fetch('/api/signature', {
                    method: 'POST',
                    headers: new Headers({
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                    }),
                    body: JSON.stringify({ 
                        signature,
                        address: _address
                    })
                  });

                  console.log('rsig', rSig)

                  // if sig was valid, we should get a token
                  const { token } = await rSig.json();
                  setJwt(token.split(" ")[1]);
            }
            console.log("hereeeeeeeeeeeeee")

            const r = await fetch(`/api/nickname?address=${_address}`);
            console.log(r)
            const json = await r.json();
            const _nickname = json.nickname;

            console.log('setting signer to', _signer)
            setSigner(_signer);
            setAddress(_address);
            setNickname(_nickname);    

            localStorage.setItem('Wallet', 'Connected');
        } catch (e) {
            console.log(e)
        }
    }

    const disconnect = async () => {
        setAddress(null);
        setNickname(null);
        setSigner(null);
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
      
        <Button
            color="secondary"
            variant="contained"
            onClick = { e => {
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
                    <Typography>{ buttonText() }</Typography>
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