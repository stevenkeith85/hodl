import Button from "@mui/material/Button";

import { useRouter } from "next/router";
import { useContext } from "react";
import { WalletContext } from '../../contexts/WalletContext';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { signIn } from "../../lib/signIn";
import { useDisconnect } from "../../hooks/useDisconnect";

export const SignInDialog = ({ signInModalOpen, setSignInModalOpen }) => {

    const { signer, address } = useContext(WalletContext);

    const disconnect = useDisconnect();
    const router = useRouter();

    const signInOnUI = async () => {
        try {
            await signIn(address, signer);
            router.push('/feed');
        } catch (e) {
            if (e.code == "ACTION_REJECTED") {
                alert("You need to sign the message to log in");
            }

            disconnect();
        }
    }

    return (
        <Dialog
            open={signInModalOpen}
            onClose={(e) => {
                // @ts-ignore
                e.stopPropagation();

                // @ts-ignore
                e.preventDefault();

                // alert("You need to sign the message to log in")
                // disconnect();
                setSignInModalOpen(false)
            }}
        >
            <DialogTitle>
                <h1>Sign In</h1>
            </DialogTitle>
            <DialogContent>
                <p>To continue, sign a message with your wallet</p>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        paddingX: 2,
                        paddingY: 1,
                        fontWeight: 500
                    }}
                    onClick={async () => {
                        await signInOnUI();
                        setSignInModalOpen(false);
                    }
                    }>
                    Sign Message</Button>
                <Button
                    color="inherit"
                    sx={{
                        paddingX: 2,
                        paddingY: 1
                    }}
                    onClick={() => {
                        disconnect();
                        setSignInModalOpen(false);
                    }}
                >Disconnect</Button>
            </DialogActions>
        </Dialog>
    )
}