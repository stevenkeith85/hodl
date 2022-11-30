import Button from "@mui/material/Button";

import { useRouter } from "next/router";
import { useContext } from "react";
import { useConnect } from "../../hooks/useConnect";
import { WalletContext } from '../../contexts/WalletContext';



interface LoginLogoutButtonProps {
    color?: "secondary" | "inherit" | "primary" | "success" | "error" | "info" | "warning";
    variant?: 'text' | 'outlined' | 'contained';
    fontSize?: string;
    sx?: object;
    closeMenu?: Function;
}

export const LoginLogoutButton: React.FC<LoginLogoutButtonProps> = ({
    color = "secondary",
    variant = "outlined",
    fontSize = '14px',
    sx = null,
    closeMenu = null

}) => {


    const [connect, disconnect] = useConnect();
    const { address } = useContext(WalletContext);
    const router = useRouter();

    return (
        <>
            {
                !address &&
                <>
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

                            closeMenu();
                            // They are clicking the sign in button, so authenticate with the BE
                            const connected = await connect(true);

                            router.push('/');
                        }}
                    >
                        Connect Wallet
                    </Button>

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
                >
                    Sign out
                </Button>
            }
        </>);
};
