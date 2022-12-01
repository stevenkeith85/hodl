import Box from "@mui/material/Box"
import { useContext, useEffect, useState } from "react";
import { WalletContext } from "../contexts/WalletContext";
import { formatEther } from '@ethersproject/units'

import Typography from "@mui/material/Typography";
import { getShortAddress } from "../lib/utils";
import { CopyText } from "./CopyText";


export const WalletDetails = () => {
    const [balance, setBalance] = useState('');
    const [network, setNetwork] = useState(null);

    const {
        address,
        signer,
        provider,
    } = useContext(WalletContext);

    useEffect(() => {
        if (!provider) {
            return;
        }

        provider.getNetwork()
            .then(network => {
                setNetwork(network)
                console.log(network)
            });

    }, [provider]);



    useEffect(() => {
        if (!signer) {
            return;
        }

        signer.getBalance()
            .then(balance => {
                const remainder = balance.mod(1e14);
                setBalance(formatEther(balance.sub(remainder)))
            });
    }, [signer]);
    return (
        <>
            {provider?.provider?.connected && <Box component="fieldset" sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid #eee', borderRadius: 1, padding: '8px 16px'}}>
                <Typography color="secondary" component="legend" fontSize={16}>wallet</Typography>
                <Typography sx={{ color: 'primary.main'}} mb={1}>address</Typography>
                <CopyText text={address} placement="top-start">
                    <Typography color="text.secondary" mb={1}>{getShortAddress(address)}</Typography>
                </CopyText>

                <Typography sx={{ color: 'primary.main'}} mb={1}>chain</Typography>
                <Typography color="text.secondary" mb={1}>{network?.name} / {network?.chainId}</Typography>

                <Typography sx={{ color: 'primary.main'}} mb={0}>balance</Typography>
                <Typography color="text.secondary" mb={0}>{balance}</Typography>
            </Box>
            }
        </>
    )
}