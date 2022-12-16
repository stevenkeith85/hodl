import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useDisconnect } from "../../hooks/useDisconnect";
import { DisconnectButton } from "./DisconnectButton";
import { SignInButton } from "./SignInButton";


export const SignInDialog = ({ signInModalOpen, setSignInModalOpen }) => {

    const disconnect = useDisconnect();

    return (
        <Dialog
            open={signInModalOpen}
            onClose={async (e) => {
                // @ts-ignore
                e.stopPropagation();

                // @ts-ignore
                e.preventDefault();

                await disconnect();
                setSignInModalOpen(false)
            }}
        >
            <DialogTitle>
                Sign In
            </DialogTitle>
            <DialogContent>
                To continue, sign a message with your wallet
            </DialogContent>
            <DialogActions>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <SignInButton onSignedIn={() => setSignInModalOpen(false)} />
                    <DisconnectButton onDisconnected={() => setSignInModalOpen(false)} />
                </Box>
            </DialogActions>
        </Dialog>
    )
}