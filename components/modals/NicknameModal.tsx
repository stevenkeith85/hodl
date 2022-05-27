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
                <Stack spacing={3}>
                    <RocketTitle title="Nickname" />
                    <NicknameForm onSuccess={() => setNicknameModalOpen(false)}/>
                </Stack>
            </HodlModal>
        </>
    )
}
