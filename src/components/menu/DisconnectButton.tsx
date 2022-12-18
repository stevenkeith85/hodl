import Button from "@mui/material/Button";

import { useContext } from "react";
import { WalletContext } from '../../contexts/WalletContext';
import { useDisconnect } from "../../hooks/useDisconnect";
import { useSignOut } from "../../hooks/useSignOut";
import { useRouter } from "next/router";


// TODO:
// We need a hook to disconnect pusher and call it from the correct places at the correct time
// import { PusherContext } from "../../contexts/PusherContext";
// const { pusher, setPusher, setUserSignedInToPusher } = useContext(PusherContext);
// pusher?.disconnect();
// setPusher(null);
// setUserSignedInToPusher(null);


export const DisconnectButton = ({ onDisconnected=() => {}}) => {
    const { walletAddress } = useContext(WalletContext);

    const disconnect = useDisconnect();

    const router = useRouter();
    const signOut = useSignOut();

    return (<>
            <Button
                disabled={!walletAddress}
                variant="contained"
                color="primary"
                sx={{
                    paddingX: 2,
                    paddingY: 1
                }}
                onClick={async e => {
                    e.stopPropagation();
                    e.preventDefault();

                    onDisconnected(); // close dialog straight away
                    await disconnect();

                    try {
                        // When the user disconnects their wallet, we also sign them out
                        await signOut();
                    } catch (e) {
                        // it shouldn't happen, but handle the case that they aren't signed in
                        // i.e. the backend would return an error
                    }

                    router.push('/');
                }}
            >
                Disconnect
            </Button>
    </>)
}
