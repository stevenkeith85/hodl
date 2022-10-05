import { CloudOff, AccountBalanceWallet } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useConnect } from "../../hooks/useConnect";
import { WalletContext } from '../../contexts/WalletContext';


interface LoginLogoutButtonProps {
    color?: "secondary" | "inherit" | "primary" | "success" | "error" | "info" | "warning";
    variant?: 'text' | 'outlined' | 'contained';
    fontSize?: string;
    sx?: object;
}

export const LoginLogoutButton: React.FC<LoginLogoutButtonProps> = ({ 
    color="secondary", 
    variant="outlined", 
    fontSize='14px', 
    sx = null,

}) => {
    const [connect, disconnect] = useConnect();
    const { address } = useContext(WalletContext);
    const router = useRouter();

    const isMobileDevice = () => {
        return 'ontouchstart' in window || 'onmsgesturechange' in window;
    };

    const connectMobile = () => {
        // router.push("https://metamask.app.link/dapp/hodlmymoon.com/");
    };

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
                        e.stopPropagation();

                        // if (isMobileDevice()) {
                        //     connectMobile();
                        // } else {
                            
                            await connect(false);
                            router.push(router.asPath);
                        // }
                    }}
                    startIcon={<AccountBalanceWallet />}
                >Connect</Button>}
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
                        await disconnect();
                        router.push('/');
                    }}
                    startIcon={<CloudOff />}
                >
                    Disconnect
                </Button>}
        </>);
};
