import Button from "@mui/material/Button";

import { useContext } from "react";
import { useConnect } from "../../hooks/useConnect";
import { WalletContext } from '../../contexts/WalletContext';

export const ConnectButton = ({ onConnected = () => { } }) => {
    const { walletAddress } = useContext(WalletContext);

    const connect = useConnect();

    return (<>
        <Button
            disabled={walletAddress}
            variant="contained"
            color="secondary"
            sx={{
                paddingX: 2,
                paddingY: 1
            }}
            onClick={async e => {
                e.stopPropagation();
                e.preventDefault();

                // deliberately not waiting here, so that we can close the menu
                connect(true);
                onConnected();
            }}
        >
            Connect Wallet
        </Button>
    </>)
}
