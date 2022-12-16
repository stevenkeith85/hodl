import Button from "@mui/material/Button";

import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { WalletContext } from '../../contexts/WalletContext';

import Box from "@mui/material/Box";
import { useSignIn } from "../../hooks/useSignIn";


export const SignInButton = ({ onSignedIn=() => {}}) => {
    const signIn = useSignIn();

    const router = useRouter();

    const { walletAddress } = useContext(WalletContext);

    const [uuid, setUuid] = useState('');

    const fetchUuid = async () => {
        try {
            const { default: axios } = await import('axios');
            const { uuid } = await axios.get(`/api/auth/uuid?address=${walletAddress}`).then(r => r.data);

            setUuid(uuid);
        } catch (e) {
            alert("unable to fetch a uuid to sign")
        }
    }

    useEffect(() => {
        if (walletAddress) {
            fetchUuid();
        }

    }, [walletAddress])

    // When the user disconnects their wallet, we also sign out.
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>
            <Button
                disabled={!walletAddress || !uuid}
                color="secondary"
                variant="contained"
                sx={{
                    paddingX: 2,
                    paddingY: 1
                }}
                onClick={async e => {
                    e.stopPropagation();
                    e.preventDefault();

                    try {
                        await signIn(uuid);
                        onSignedIn();
                        router.push('/feed');
                    } catch (e) {
                        // user rejected the sign in request
                    }
                }}
            >
                Sign Message
            </Button> 
            
        </Box>);
};
