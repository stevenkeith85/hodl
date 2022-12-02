import { Tooltip, Box, Button, Stack, Typography } from "@mui/material";
import { HodlModal } from "./HodlModal";
import { useNickname } from "../../hooks/useNickname";
import { Formik, Form, Field } from 'formik';
import { nicknameValidationSchema } from "../../validation/nickname";
import { InputBase } from "formik-mui";
import { useContext, useState } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { useUser } from "../../hooks/useUser";
import { HodlLoadingSpinner } from "../HodlLoadingSpinner";


export const NicknameModal = ({ nicknameModalOpen, setNicknameModalOpen }) => {
    const updateNickname = useNickname();

    const { address } = useContext(WalletContext);
    const userSWR = useUser(address);

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (!userSWR?.data) {
        return null;
    }


    return (
        <>
            <HodlModal
                open={nicknameModalOpen}
                setOpen={setNicknameModalOpen}
                sx={{
                    maxWidth: '90vw'
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                    <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 600, marginBottom: 2 }}>Nickname</Typography>
                    <Typography sx={{
                        marginBottom: 2,
                        color: theme => theme.palette.text.secondary,
                    }}>Enter a nickname to use as an alias for your wallet address</Typography>
                    <Formik
                        initialValues={{ nickname: userSWR?.data?.nickname }}
                        validationSchema={nicknameValidationSchema}
                        onSubmit={async (values) => {
                            setLoading(true);
                            const { success, message } = await updateNickname(values.nickname);
                            if (success) {
                                userSWR.mutate(old => ({...old, nickname: values.nickname}), {revalidate: false});
                            }
                            setLoading(false);
                            setMessage(message);
                        }}
                    >
                        {({ isSubmitting, errors, setFieldValue, values }) => (
                            <Form>
                                <Stack spacing={2}>
                                    <Field
                                        validateOnChange
                                        autoComplete='off'
                                        component={InputBase}
                                        sx={{
                                            border: (errors.nickname) ? theme => `1px solid ${theme.palette.error.main}` : `1px solid #ccc`,
                                            borderRadius: 1,
                                            paddingY: 1,
                                            paddingX: 1.5
                                        }}
                                        fullWidth
                                        placeholder=""
                                        name="nickname"
                                        type="text"
                                        onChange={e => {
                                            setMessage('');
                                            const value = e.target.value || "";
                                            setFieldValue('nickname', value.toLowerCase());
                                        }}
                                    />
                                    <Box sx={{ height: '20px', marginBottom: '16px', color: 'text.secondary' }}>
                                        {loading ? <HodlLoadingSpinner />
                                            : message || errors?.nickname
                                        }
                                    </Box>
                                    <Box display="grid" gridTemplateColumns={"1fr 1fr"} gap={4}>
                                        <Button
                                            disabled={loading || values.nickname === userSWR?.data?.nickname}
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                paddingY: 1.5,
                                                paddingX: 3
                                            }}
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

                                </Stack>
                            </Form>
                        )}
                    </Formik>
                </div>
            </HodlModal>
        </>
    )
}
