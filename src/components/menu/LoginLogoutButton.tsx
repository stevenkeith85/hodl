import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CloudOffIcon from '@mui/icons-material/CloudOff';

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
                            await connect(false);
                            window.location.href = router.asPath;
                    }}
                    startIcon={<AccountBalanceWalletIcon />}
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
                    startIcon={<CloudOffIcon />}
                >
                    Disconnect
                </Button>}
        </>);
};
