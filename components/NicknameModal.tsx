import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useNickname } from "../hooks/useNickname";
import { HodlButton } from "./HodlButton";
import { HodlModal } from "./HodlModal";
import { HodlTextField } from "./HodlTextField";
import { RocketTitle } from "./RocketTitle";

export const NicknameModal = ({ nicknameModalOpen, setNicknameModalOpen }) => {
    const [desiredNickname, setDesiredNickname] = useState('');
    const [updateNickname, updateErrors, setUpdateErrors] = useNickname();

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
                    <HodlTextField
                        label="Nickname"
                        value={desiredNickname}
                        // @ts-ignore
                        onInput={() => setUpdateErrors([])}
                        onChange={e => setDesiredNickname(e.target.value)}
                        required
                        error={updateErrors.length}
                        // @ts-ignore
                        helperText={updateErrors.join(', ')}
                    />
                    <HodlButton
                        onClick={() => {
                            if (desiredNickname && (desiredNickname.length >= 3 || desiredNickname.length <= 20)) {
                                // @ts-ignore
                                updateNickname(desiredNickname);
                            } else {
                                // @ts-ignore
                                setUpdateErrors(['A nickname between 3 and 20 characters is required'])
                            }
                        }}
                    >
                        Set
                    </HodlButton>
                </Stack>
            </HodlModal>
        </>
    )
}