import Box from "@mui/material/Box"
import { useContext, useEffect, useState } from "react";
import { WalletContext } from "../contexts/WalletContext";
import { formatEther } from '@ethersproject/units'

import Typography from "@mui/material/Typography";
import { getShortAddress } from "../lib/getShortAddress";
import { CopyText } from "./CopyText";
import { chains } from "../lib/chains";


export const WalletDetails = () => {
    const [balance, setBalance] = useState('');
    const [network, setNetwork] = useState(null);

    const {
        walletAddress,
        signer,
        provider,
    } = useContext(WalletContext);

    useEffect(() => {
        if (provider) {
            provider.getNetwork()
                .then(network => {
                    setNetwork(network)
                });
        } else {
            setNetwork(null);
        }
    }, [provider]);



    useEffect(() => {
        if (signer) {
            signer.getBalance()
                .then(balance => {
                    const remainder = balance.mod(1e14);
                    setBalance(formatEther(balance.sub(remainder)))
                });
        } else {
            setBalance('');
        }

    }, [signer]);

    if (!walletAddress) {
        return null;
    }

    return (
        <>
            <Box
                component="fieldset"
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    border: `1px solid #eee`,
                    background: '#fcfcfc',
                    borderRadius: 1,
                    padding: 2,
                    gap: 1
                }}>
                <Typography
                    sx={{
                        color: 'text.primary',
                    }}
                    component="legend"
                >
                    Wallet
                </Typography>

                    <Typography sx={{ color: 'text.primary' }} mb={1}>Address</Typography>
                    <CopyText text={walletAddress} placement="top-start">
                        <Typography color="success.dark" mb={1}>{getShortAddress(walletAddress)}</Typography>
                    </CopyText>
                    {chains[network?.name] && <>
                        <Typography sx={{ color: 'text.primary' }} mb={1}>Chain</Typography>
                        <Typography color="success.dark" mb={1}>{chains[network?.name]?.chainName || network?.name}</Typography>

                        <Typography sx={{ color: 'text.primary' }} mb={1}>Balance</Typography>
                        <Typography color={Number(balance) > 0 ? "success.dark" : "error"} mb={1}>{`${balance} ${chains[network?.name]?.nativeCurrency?.symbol}`}</Typography>
                    </>
                    }
                    {!chains[network?.name] && <>
                        <Typography sx={{ color: "success.dark" }} mb={1}>Chain</Typography>
                        <Typography color="error" mb={1}>{network?.name} / {network?.chainId}</Typography>
                        <Typography sx={{ color: 'text.primary' }} mb={1}>Balance</Typography>
                        <Typography color={Number(balance) > 0 ? "success.dark" : "error"} mb={1}>{balance}</Typography>
                    </>
                    }
            </Box>
        </>
    )
}