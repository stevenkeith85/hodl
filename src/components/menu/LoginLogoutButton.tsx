import CloudOffIcon from '@mui/icons-material/CloudOff';

import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { useConnect } from "../../hooks/useConnect";
import { WalletContext } from '../../contexts/WalletContext';
import { AccountBalanceWalletIcon } from '../icons/AccountBalanceWalletIcon';
import MetaMaskOnboarding from '@metamask/onboarding'
import { isMobileDevice } from '../../lib/utils';
import { Typography } from '@mui/material';


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

    const getButtonText = () => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            return 'Sign in with MetaMask';
        } else {
            return 'Install a MetaMask Wallet'
        }
    }

    useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding();
        }
    }, []);

    return (
        <>
        {/* if its a mobile and its not the metamask mobile browser give the user the deeplink button */}
            {
                isMobileDevice() &&
                (!/MetaMaskMobile/.test(navigator.userAgent)) &&
                <>
                    <Button
                        onClick={() => location.href = `https://metamask.app.link/dapp/${window.location.href}`}
                        color={color}
                        variant={variant}
                        sx={{
                            fontSize,
                            ...sx,
                        }}
                        startIcon={<AccountBalanceWalletIcon size={22} />}>Open MetaMask Mobile</Button>
                </>
            }
            {
                (!address && !isMobileDevice() || (!address && isMobileDevice() && (/MetaMaskMobile/.test(navigator.userAgent)))) &&
                <>
                    <Button
                        color={color}
                        variant={variant}
                        sx={{
                            fontSize,
                            ...sx,
                        }}
                        startIcon={<AccountBalanceWalletIcon size={22} />}
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
                    >{getButtonText()}</Button>

                </>
            }
            {
                address &&
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
                    Sign Out
                </Button>
            }
        </>);
};
