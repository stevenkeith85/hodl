import { CloudOff, AccountBalanceWallet } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useConnect } from "../../hooks/useConnect";
import { WalletContext } from '../../contexts/WalletContext';


export const LoginLogoutButton = ({ }) => {
    const [connect, disconnect] = useConnect();
    const { address } = useContext(WalletContext);
    const router = useRouter();

    const isMobileDevice = () => {
        return 'ontouchstart' in window || 'onmsgesturechange' in window;
    };

    const connectMobile = () => {
        router.push("https://metamask.app.link/dapp/192.168.1.242:3001/");
    };

    return (
        <>
            {!address &&
                <Button
                    color="secondary"
                    onClick={(e) => {
                        e.stopPropagation();

                        if (isMobileDevice()) {
                            connectMobile();
                        } else {
                            connect(false);
                        }
                    }}
                    startIcon={<AccountBalanceWallet />}
                >Connect</Button>}
            {address &&
                <Button
                    color="secondary"
                    onClick={e => {
                        e.stopPropagation();
                        disconnect();
                    }}
                    startIcon={<CloudOff />}
                >
                    Disconnect
                </Button>}
        </>);
};
