import CloudOffIcon from '@mui/icons-material/CloudOff';

import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { useConnect } from "../../hooks/useConnect";
import { WalletContext } from '../../contexts/WalletContext';
import { AccountBalanceWalletIcon } from '../icons/AccountBalanceWalletIcon';
import MetaMaskOnboarding from '@metamask/onboarding'


interface LoginLogoutButtonProps {
    color?: "secondary" | "inherit" | "primary" | "success" | "error" | "info" | "warning";
    variant?: 'text' | 'outlined' | 'contained';
    fontSize?: string;
    sx?: object;
}

export const LoginLogoutButton: React.FC<LoginLogoutButtonProps> = ({
    color = "secondary",
    variant = "outlined",
    fontSize = '14px',
    sx = null,

}) => {
    const onboarding = useRef<MetaMaskOnboarding>();

    const [connect, disconnect] = useConnect();
    const { address } = useContext(WalletContext);
    const router = useRouter();

    useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding();
        }
    }, []);

    return (
        <>
            {!address &&
                <Button
                    color={color}
                    variant={variant}
                    sx={{
                        fontSize,
                        ...sx,
                    }}
                    onClick={async e => {
                        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
                            e.stopPropagation();
                            e.preventDefault();

                            const connected = await connect(false);

                            if (connected) {
                                window.location.href = router.asPath;
                            }
                        } else {
                            onboarding.current.startOnboarding();
                        }


                    }}
                    startIcon={<AccountBalanceWalletIcon size={22} />}
                >{
                        MetaMaskOnboarding.isMetaMaskInstalled() ? 'Connect' : 'Install MetaMask'
                    }</Button>}
            {address &&
                <Button
                    color={color}
                    variant={variant}
                    sx={{
                        fontSize,
                        ...sx,
                    }}
                    onClick={async e => {
                        e.stopPropagation();
                        e.preventDefault();

                        await disconnect();
                        router.push('/');
                    }}
                    startIcon={<CloudOffIcon />}
                >
                    Disconnect
                </Button>}
        </>);
};
