import Button from "@mui/material/Button";

import { useRouter } from "next/router";
import { useContext } from "react";
import { useConnect } from "../../hooks/useConnect";
import { WalletContext } from '../../contexts/WalletContext';
import { useDisconnect } from "../../hooks/useDisconnect";
import { PusherContext } from "../../contexts/PusherContext";


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
    const [connect] = useConnect();
    const disconnect = useDisconnect();

    const { address } = useContext(WalletContext);
    const router = useRouter();

    const {pusher, setPusher, setUserSignedInToPusher} = useContext(PusherContext);

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

                            closeMenu && closeMenu();
                            // They are clicking the sign in button, so authenticate with the BE
                            const connected = await connect(true, true);

                            router.push('/feed');
                        }}
                    >
                        Connect wallet
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

                        // TODO: We need to test the pusher disconnect actually works correctly and perhaps do this somewhere centralised
                        pusher?.disconnect();
                        setPusher(null);
                        setUserSignedInToPusher(null);
                        router.push('/');
                    }}
                >
                    Sign out
                </Button>
            }
        </>);
};
