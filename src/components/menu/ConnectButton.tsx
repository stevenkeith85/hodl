import Button from "@mui/material/Button";

import { useContext } from "react";
import { useConnect } from "../../hooks/useConnect";
import { WalletContext } from '../../contexts/WalletContext';

export const ConnectButton = ({
    onConnected = () => { },
    text = "Connect Wallet",
    variant = "contained" as "text" | "contained" | "outlined",
    sx = {}
}) => {
    const { walletAddress } = useContext(WalletContext);

    const connect = useConnect();

    return (<>
        <Button
            disabled={walletAddress}
            variant={variant}
            color="secondary"
            sx={{
                paddingX: 2,
                paddingY: 1,
                ...sx
            }}
            onClick={async e => {
                e.stopPropagation();
                e.preventDefault();

                await connect(true);
                onConnected();
            }}
        >
            {text}
        </Button>
    </>)
}
