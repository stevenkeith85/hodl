import { Alert, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { HodlButton } from "./HodlButton";
import { HodlModal } from "./HodlModal";
import { RocketTitle } from "./RocketTitle";

export const UnableToStoreModal = ({ unableToSaveModalOpen, setUnableToSaveModalOpen, tokenId, retry}) => (
    <HodlModal
        open={unableToSaveModalOpen}
        setOpen={setUnableToSaveModalOpen}
    >
        <Stack spacing={4}>
            <RocketTitle title="Unable to Add Token..." />
            <Typography sx={{ span: { fontWeight: 600 } }}>
                Your token <span>was</span> minted on the blockchain, but we had a problem adding it to HodlMyMoon
            </Typography>
            <Typography sx={{ span: { fontWeight: 600 } }}>
                <span>Do not re-mint your token</span>. 
            </Typography>
            <Alert sx={{ span: { fontWeight: 600 } }}>
                If this is the <span>first time</span> your have encountered this dialog, we suggest waiting ~60 seconds, and then click <span>retry</span>.
            </Alert>
            <Alert severity="warning" sx={{ span: { fontWeight: 600 } }}>
                If this <span>isn&apos;t</span> the first time you&apos;ve encountered this dialog, we suggest your send us a message
            </Alert>

            <Stack direction="row" spacing={2}>
                <HodlButton onClick={async() => {
                    setUnableToSaveModalOpen(false); 
                    setTimeout(retry, 1000);
                }}>
                    Retry
                </HodlButton>
                <Link href={`mailto:support@hodlmymoon.com?subject=Add my HodlNFT to HodlMyMoon (DO NOT EDIT)&body=Please add my HodlNFT to HodlMyMoon. It has the following tokenId: ${tokenId}`} passHref>
                    <HodlButton color="secondary">
                        Send Message
                    </HodlButton>
                </Link>
            </Stack>
            
        </Stack>
    </HodlModal>
)