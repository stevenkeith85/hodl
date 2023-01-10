import { useNickname } from "../../hooks/useNickname";
// import { nicknameValidationSchema } from "../../validation/nickname";
import { useContext, useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { SignedInContext } from "../../contexts/SignedInContext";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { nicknameValidationSchema } from "../../validation/nickname";


export const NicknameModal = ({ nicknameModalOpen, setNicknameModalOpen }) => {
    const updateNickname = useNickname();

    const { signedInAddress: address } = useContext(SignedInContext);
    const userSWR = useUser(address);

    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [valid, setValid] = useState(true);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        if (userSWR?.data?.nickname) {
            setNickname(userSWR?.data?.nickname)
        }
    }, [userSWR?.data?.nickname]);


    const submitNickname = async () => {
        setLoading(true);
        const { success, message } = await updateNickname(nickname);
        if (success) {
            userSWR.mutate(old => ({ ...old, nickname }), { revalidate: false });
        }
        setLoading(false);
        setMessage(message);
    }

    if (!userSWR?.data) {
        return null;
    }

    return (
        <>
            <Dialog
                fullScreen={fullScreen}
                maxWidth="xs"
                fullWidth
                open={nicknameModalOpen}
                onClose={(e) => {
                    // @ts-ignore
                    e.stopPropagation();

                    // @ts-ignore
                    e.preventDefault();

                    setNicknameModalOpen(false);
                }}
            >
                <DialogTitle>Nickname</DialogTitle>
                <DialogContent
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                    <Box
                        sx={{
                            flex: 0
                        }}>
                        <Typography
                            sx={{
                                color: 'text.secondary',
                            }}>
                            Enter a nickname to use as an alias for your address
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1
                        }}>
                        <TextField
                            autoComplete='off'
                            error={!valid}
                            fullWidth
                            placeholder=""
                            name="nickname"
                            type="text"
                            value={nickname}
                            onChange={e => {
                                setMessage('');
                                const value = e.target.value || "";
                                setNickname(value.toLowerCase());

                                nicknameValidationSchema.isValid({nickname: value.toLowerCase()}).then(valid => setValid(valid))
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            flex: 0,
                            color: 'text.secondary'
                        }}>
                        {
                            loading ? <HodlLoadingSpinner /> : message
                        }
                    </Box>
                    <Box
                        sx={{
                            flex: 0
                        }}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 4
                            }}
                        >
                            <Button
                                disabled={loading || nickname === userSWR?.data?.nickname || !valid}
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{
                                    paddingY: 1.5,
                                    paddingX: 3
                                }}
                                onClick={submitNickname}
                            >
                                Select
                            </Button>
                            <Button
                                variant="contained"
                                color="inherit"
                                sx={{
                                    paddingY: 1.5,
                                    paddingX: 3
                                }}
                                onClick={() => {
                                    setMessage('');
                                    setNicknameModalOpen(false)
                                }}
                            >
                                Close
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}
