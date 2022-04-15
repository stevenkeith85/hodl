import { Stack, Typography } from "@mui/material";
import { HodlModal } from "../HodlModal";
import { RocketTitle } from "../RocketTitle";
import { NicknameForm } from "../forms/NicknameForm";


export const NicknameModal = ({ nicknameModalOpen, setNicknameModalOpen }) => {
    return (
        <>
            <HodlModal
                open={nicknameModalOpen}
                setOpen={setNicknameModalOpen}
            >
                <Stack spacing={4}>
                    <RocketTitle title="Nickname" />
                    <Typography sx={{ paddingLeft: 1 }}>
                        Wallet addresses are hard to remember. Use a nickname instead.
                    </Typography>
                    <Typography sx={{ paddingLeft: 1 }}>
                        You can change this at any time.
                    </Typography>
                    <NicknameForm onSuccess={() => setNicknameModalOpen(false)}/>
                </Stack>
            </HodlModal>
        </>
    )
}
